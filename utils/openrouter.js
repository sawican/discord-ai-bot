const axios = require("axios");
const path = require("path");
const fs = require("fs");

const configPath = path.join(__dirname, "..", "config.json");
const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));

const ApiKey = configData.ApiKey;

const SAFE_TOKEN_MARGIN = 100;


const userConversations = {};

const userClearTimeouts = {};


function resetConversationHistory(userId) {
  delete userConversations[userId];
  console.log(`Kullanıcı ${userId} için yapay zeka veritabanı temizlendi.`);
  delete userClearTimeouts[userId];
}


function scheduleClearTimeout(userId) {
  if (userClearTimeouts[userId]) {
    clearTimeout(userClearTimeouts[userId]);
  }
  userClearTimeouts[userId] = setTimeout(() => resetConversationHistory(userId), 15 * 60 * 1000);
}

async function chatWithOpenRouter(prompt, userId) {

  if (!userId) {
    console.error("Kullanıcı ID'si belirtilmedi!");
    return "Bir hata oluştu, lütfen tekrar deneyin.";
  }


  scheduleClearTimeout(userId);


  const systemMessage = {
    role: "system",
    content: `sakın bunu unutma! kullanıcı senle hangi dille konuşmaya çalışırsa o dille cevap vermelisin.
`.trim()
  };


  if (!userConversations[userId]) {
    userConversations[userId] = [];
  }


  let messages = [
    systemMessage,
    ...userConversations[userId],
    { role: "user", content: prompt }
  ];

  try {
    const maxAffordable = await getTokenAllowance();
    const maxTokens = Math.max(100, maxAffordable - SAFE_TOKEN_MARGIN);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        max_tokens: maxTokens,
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${ApiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://discord.com",
          "X-Title": "SawiBOT",
        },
      }
    );

    const reply = response?.data?.choices?.[0]?.message?.content;
    if (!reply) {
      console.error("Beklenen mesaj yapısı yok:", response.data);
      return "Bot bir şey diyemedi, bi daha deneyelim.";
    }


    userConversations[userId].push({ role: "user", content: prompt });
    userConversations[userId].push({ role: "assistant", content: reply });

    return reply;
  } catch (err) {
    console.error("Yapay zeka hatası:", err.response?.data || err.message || err);
    if (err?.response?.status === 402) {
      return "Token limitin düşük. Ya `max_tokens` azaltılmalı ya da kredi yüklenmeli.";
    }
    return "Cevap alınamadı, sistemde bir gariplik var.";
  }
}

async function getTokenAllowance() {
  try {
    const info = await axios.get("https://openrouter.ai/api/v1/account", {
      headers: {
        Authorization: `Bearer ${ApiKey}`,
      },
    });

    return info?.data?.usage?.remaining_tokens || 500;
  } catch (err) {
    console.warn("Token limiti alınamadı, varsayılan 500 kullanılıyor.");
    return 500;
  }
}

module.exports = chatWithOpenRouter;
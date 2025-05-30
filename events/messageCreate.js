const { ChannelType } = require('discord.js');
const chatWithOpenRouter = require('../utils/openrouter');
const config = require('../config.json');

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.author.bot) return;


        const userId = message.author.id;

        if (message.channel.type === ChannelType.DM) {
            try {
                await message.channel.sendTyping();

                const reply = await chatWithOpenRouter(message.content, userId);
                await message.reply(reply).catch(() => null);
            } catch (error) {
                console.error('DM Hatası:', error);
                await message.reply('❌ Şu anda cevap veremiyorum.').catch(() => null);
            }
            return;
        }

        if (message.content.startsWith(config.prefix)) {
            const args = message.content.slice(config.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = client.prefixCommands.get(commandName) || 
                            client.prefixCommands.find(cmd => cmd.aliases?.includes(commandName));

            if (!command) {
                await message.reply('❌ Böyle bir komut yok!').catch(() => null);
                return;
            }

            try {
                await command.execute(message, args, config, client);
            } catch (error) {
                console.error('Komut Hatası:', error);
                await message.reply('❌ Komut çalıştırılamadı!').catch(() => null);
            }
            return;
        }

        if (message.mentions.has(client.user.id) || 
           (message.reference && (await message.channel.messages.fetch(message.reference.messageId).catch(() => null))?.author.id === client.user.id)) {
            
            const prompt = message.content
                .replace(`<@${client.user.id}>`, '')
                .replace(`<@!${client.user.id}>`, '')
                .trim();

            if (!prompt && !message.reference) {
                await message.reply("Merhaba, nasıl yardımcı olabilirim?").catch(() => null);
                return;
            }

            try {
                await message.channel.sendTyping();

                const reply = await chatWithOpenRouter(prompt, userId);
                await message.reply(reply).catch(() => null);
            } catch (error) {
                console.error('Yanıt Hatası:', error);
                await message.reply('❌ Şu anda cevap veremiyorum.').catch(() => null);
            }
        }
    }
};
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    // Slash komutlarını oku
    const commands = [];
    const commandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./commands/slash/${file}`);
      if (command.data) {
        commands.push(command.data.toJSON());
        console.log(`✔️ ${command.data.name} komutu yüklendi`);
      }
    }

    // Global olarak deploy et
    await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
    console.log(`✅ ${commands.length} slash komutu global olarak yüklendi!`);

  } catch (error) {
    console.error('❌ DEPLOY HATASI:', error);
  }
})();

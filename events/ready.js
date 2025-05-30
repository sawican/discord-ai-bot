const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        try {
            client.user.setPresence({
                status: 'online',
                activities: [{
                  
                    name: 'Sawi Yapay zeka',//botun durumuna ne yazmak istiyorsan onu Sawi Yapay zeka yazısını silip kendi yazını yaz
                    type: ActivityType.Playing
                }]
            });
        } catch (err) {
            console.log('Durum ayarlanamadı:', err.message);
        }

        console.log(`✅ ${client.user.tag} Aktif!`);
    }
};

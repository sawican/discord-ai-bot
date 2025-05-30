const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Botun ping değerlerini gösterir.',

    async execute(message, args, client) {
        try {
            const start = Date.now();
            const authorAvatar = message.author?.displayAvatarURL?.({ dynamic: true }) || null;
            const botAvatar = client.user?.displayAvatarURL?.() || null;

            const loadingEmbed = new EmbedBuilder()
                .setColor('#2F3136')
                .setAuthor({
                    name: 'Ping Ölçülüyor...',
                    iconURL: authorAvatar
                })
                .setDescription('Lütfen bekleyin, ping değerleri hesaplanıyor...');

            const sentMessage = await message.reply({ embeds: [loadingEmbed] });

            const botLatency = Date.now() - start;
            const wsPing = client.ws?.ping ?? 'N/A';
            const msgLatency = sentMessage.createdTimestamp - message.createdTimestamp;

            let durum = 'Normal';
            if (wsPing !== 'N/A') {
                durum = wsPing < 100 ? 'İyi' : wsPing < 200 ? 'Normal' : 'Kötü';
            }

            const resultEmbed = new EmbedBuilder()
                .setColor('#2F3136')
                .setAuthor({
                    name: 'Ping Değerleri',
                    iconURL: botAvatar
                })
                .addFields(
                    { name: '📊 Bot Gecikmesi:', value: `\`${botLatency}ms\``, inline: true },
                    { name: '🌐 WebSocket Gecikmesi:', value: `\`${wsPing}ms\``, inline: true },
                    { name: '⏰ Mesaj Gecikmesi:', value: `\`${msgLatency}ms\``, inline: true }
                )
                .setFooter({
                    text: `${message.author.tag} tarafından istendi`,
                    iconURL: authorAvatar
                })
                .setTimestamp();

            await sentMessage.edit({ embeds: [resultEmbed] });

        } catch (error) {
            console.error('Ping komutunda hata:', error);
        }
    }
};

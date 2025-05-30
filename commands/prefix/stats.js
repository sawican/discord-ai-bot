const { EmbedBuilder } = require('discord.js');
const os = require('os');
const process = require('process');

module.exports = {
    name: 'istatistik',
    description: 'Botun istatistiklerini gösterir',
    aliases: ['statistics', 'stats'],
    prefixCommand: true,

    execute(message) {
        const title = '📊 Bot İstatistikleri';
        const uptimeLabel = '⏳ Çalışma Süresi';
        const memoryLabel = '🧠 Bellek Kullanımı';
        const cpuLabel = '⚙️ İşlemci';
        const nodeLabel = '💻 Node.js Sürümü';
        const djsLabel = '🤖 Discord.js Sürümü';
        const osLabel = '📂 İşletim Sistemi';
        const pidLabel = 'İşlem PID';

        const totalSeconds = process.uptime();
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const uptimeString = `${days} gün, ${hours} saat, ${minutes} dakika, ${seconds} saniye`;

        const memoryUsage = process.memoryUsage();
        const usedRAM = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
        const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

        const cpuModel = os.cpus()[0].model;
        const cpuCores = os.cpus().length;

        const nodeVersion = process.version;
        const discordJsVersion = require('discord.js').version;

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(title)
            .addFields(
                { name: uptimeLabel, value: uptimeString, inline: false },
                { name: memoryLabel, value: `${usedRAM} MB / ${totalRAM} GB`, inline: false },
                { name: cpuLabel, value: `${cpuModel} (${cpuCores} çekirdek)`, inline: false },
                { name: nodeLabel, value: nodeVersion, inline: false },
                { name: djsLabel, value: discordJsVersion, inline: false },
                { name: osLabel, value: `${os.type()} ${os.arch()}`, inline: false }
            )
            .setFooter({ text: `${pidLabel}: ${process.pid}` })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};

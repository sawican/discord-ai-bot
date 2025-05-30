const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');
const process = require('process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Botun istatistiklerini gösterir'),

    async execute(interaction) {

        const l = {
            title: '📊 Bot İstatistikleri',
            uptime: '⏳ Çalışma Süresi',
            memory: '🧠 Bellek Kullanımı',
            cpu: '⚙️ İşlemci',
            node: '💻 Node.js Sürümü',
            djs: '🤖 Discord.js Sürümü',
            os: '📂 İşletim Sistemi',
            cores: 'çekirdek',
            days: 'gün',
            hours: 'saat',
            minutes: 'dakika',
            seconds: 'saniye'
        };


        const totalSeconds = process.uptime();
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        const uptimeString = `${days} ${l.days}, ${hours} ${l.hours}, ${minutes} ${l.minutes}, ${seconds} ${l.seconds}`;


        const memoryUsage = process.memoryUsage();
        const usedRAM = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
        const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);


        const cpuModel = os.cpus()[0].model;
        const cpuCores = os.cpus().length;


        const nodeVersion = process.version;
        const discordJsVersion = require('discord.js').version;

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(l.title)
            .addFields(
                { name: l.uptime, value: uptimeString, inline: false },
                { name: l.memory, value: `${usedRAM} MB / ${totalRAM} GB`, inline: false },
                { name: l.cpu, value: `${cpuModel} (${cpuCores} ${l.cores})`, inline: false },
                { name: l.node, value: nodeVersion, inline: false },
                { name: l.djs, value: discordJsVersion, inline: false },
                { name: l.os, value: `${os.type()} ${os.arch()}`, inline: false }
            )
            .setFooter({ text: `PID: ${process.pid}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};

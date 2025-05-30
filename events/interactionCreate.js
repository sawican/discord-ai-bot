module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Komut çalıştırılırken hata oluştu.', 
                ephemeral: true 
            }).catch(() => {});
        }
    }
};


const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies pong'),

    async execute(interaction) {
        await interaction.reply({ content: 'Secret Pong!', ephemeral: true });
    }
};
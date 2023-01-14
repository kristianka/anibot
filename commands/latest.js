const fetchFromAPI = require('../functions/fetchAPI.js')
const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('latest')
        .setDescription('Provides latest 10 releases.'),
    async execute(interaction) {
        try {
            await interaction.reply({ content: 'Fetching, please wait...', ephemeral: true });
            const currentTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            const channel = interaction.guild.channels.cache.get(process.env.DEV_CHANNEL_ID);
            let convertedMsg = '\n';
            let max = 10;
            for (let i = 0; i < max; i++) {
                let showName = await fetchFromAPI('name', i);
                let pubTime = await fetchFromAPI('time', i);
                if (showName.includes("[Batch]")) {
                    console.log("Skipping batch", showName);
                    max += 1;
                }
                else {
                    convertedMsg += (' - ' + showName + ' at ' + pubTime + '\n');
                }
            }
            console.log("Sending", convertedMsg, "to chat", channel.name);
            channel.send(`Latest 1080p episode releases at ${currentTime()} are: ${convertedMsg}`);

        } catch (error) {
            console.log("Error sending message: ", error);
        }
    }
}

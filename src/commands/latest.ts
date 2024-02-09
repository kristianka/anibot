import { main } from "../functions/fetchFromAPI.js";
import { getDay, getTime } from "../misc.js";
import { SlashCommandBuilder } from "discord.js";

import dotenv from "dotenv";
dotenv.config();

export default {
    data: new SlashCommandBuilder()
        .setName("latest")
        .setDescription("Provides latest 10 releases."),

    async execute(interaction) {
        try {
            const channel = interaction.guild.channels.cache.get(process.env.DEV_CHANNEL_ID);
            await interaction.reply({ content: "Fetching, please wait... ⌛", ephemeral: true });

            let convertedMsg = "\n";
            let max = 10;

            const items = await main();

            for (let i = 0; i < max; i++) {
                // clear strings
                const rawTitle = items[i].title.toString();
                const category = items[i].category.toString();
                const pubDate = items[i].pubDate.toString();

                const titleWithEpisodeNum = rawTitle.slice(0, -23).slice(13);
                const pubTimeLocal = getTime(pubDate);
                const pubDateLocal = getDay(pubDate);

                // If a batch release then skip and add one to max amount fetched shows
                if (rawTitle.includes("[Batch]")) {
                    console.log("Skipping batch", category);
                    max += 1;
                    return;
                }

                convertedMsg += ` - ${titleWithEpisodeNum} on ${pubDateLocal} at ${pubTimeLocal} \n`;
            }
            console.log("Sending", convertedMsg, "to chat", channel.name);
            channel.send(`## Latest 1080p episode releases
             \n ${convertedMsg}`);
        } catch (error) {
            console.log("Error sending message: ", error);
        }
    }
};

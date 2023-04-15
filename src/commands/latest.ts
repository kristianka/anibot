/* eslint-disable brace-style */
/* eslint-disable no-console */
"use strict";

import fetchFromAPI from "../functions/fetchAPI.js";

import { SlashCommandBuilder } from "discord.js";

import dotenv from 'dotenv'
dotenv.config();

export default {
    data: new SlashCommandBuilder()
        .setName("latest")
        .setDescription("Provides latest 10 releases."),

    async execute(interaction) {
        try {
            const channel = interaction.guild.channels.cache.get(process.env.DEV_CHANNEL_ID);
            await interaction.reply({ content: "Fetching, please wait...", ephemeral: true });

            let currentTime: string;
            let convertedMsg = "\n";
            let max = 10;

            for (let i = 0; i < max; i++) {
                const showName: string = (await fetchFromAPI("name", i)).showName;
                const pubTimes: string[] = (await fetchFromAPI("time", i)).pubTime;

                if (showName.includes("[Batch]")) {
                    console.log("Skipping batch", showName);
                    max += 1;
                }
                else {
                    convertedMsg += (` - ${showName} on ${pubTimes[0]} at ${pubTimes[1]}\n`);
                }
                currentTime = pubTimes[2];
            }
            console.log("Sending", convertedMsg, "to chat", channel.name);
            channel.send(`Latest 1080p episode releases at ${currentTime} are: ${convertedMsg}`);

        } catch (error) {
            console.log("Error sending message: ", error);
        }
    }
};

/* eslint-disable no-console */
"use strict";

import { REST, Routes } from "discord.js";

import dotenv from "dotenv";
dotenv.config();

const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN } = process.env;
import * as fs from "fs";

const commands = [];

// Grab all the command files from the commands directory you created earlier
const commandPath = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandPath) {
    const command = await import(`file://${commandPath}/${file}`);
    commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data: any = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands
        });

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();

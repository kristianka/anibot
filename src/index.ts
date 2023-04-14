/* eslint-disable jsdoc/require-jsdoc */
"use strict";

import * as fs from 'fs';
import * as path from 'path';

import dotenv from 'dotenv'
dotenv.config({ path: "../.env" });

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Client, Collection, GatewayIntentBits } from "discord.js";
import watching from "./functions/watching.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const client: any = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


// fetch all the commands from /commands/ folder
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = await import(`file://${commandsPath}/${file}`);
    client.commands.set(command.default.data.name, command);
}


// fetch all the events from /events/ folder
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const command = await import(`file://${eventsPath}/${file}`);
    if (command.default.once) {
        client.once(command.default.name, (...args) => command.default.execute(...args));
    } else {
        client.on(command.default.name, (...args) => command.default.execute(...args));
    }
}

// fetch shows every 5 minutes
function fetchShows() {
    setTimeout(() => {
        watching();
        fetchShows();
    }, 300000);
}

fetchShows();

client.login(process.env.DISCORD_TOKEN);

// module.exports.Gbot = client;
export default { Gbot: client };

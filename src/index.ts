"use strict";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { fileURLToPath } from "url";
dotenv.config({ path: "../.env" });
import watching from "./functions/watching.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client: Client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

const main = async () => {
    // import all the commands from /commands/ folder and add them to the client.commands collection
    for (const file of commandFiles) {
        const command = await import(`file://${commandsPath}/${file}`);
        client.commands.set(command.default.data.name, command);
    }

    // import all the events from /events/ folder and add them to the client.events collection
    for (const file of eventFiles) {
        const command = await import(`file://${eventsPath}/${file}`);
        if (command.default.once) {
            client.once(command.default.name, (...args) => command.default.execute(...args));
        } else {
            client.on(command.default.name, (...args) => command.default.execute(...args));
        }
    }

    // fetch shows every 5 minutes
    function fetchShows(): void {
        setTimeout(() => {
            watching();
            fetchShows();
        }, 1000 * 60 * 5);
    }

    fetchShows();

    client.login(process.env.DISCORD_TOKEN);
};

main();
// pass client to other files
export default client;

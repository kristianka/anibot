const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const resetData = require('./functions/resetData');
const watching = require('./functions/watching.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// fetch all the commands from /commands/ folder
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// fetch all the events from /events/ folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// fetch shows every 5 minutes
function fetchShows() {
    setTimeout(() => {
        watching.watching();
        fetchShows();
    }, "300000");
};

fetchShows();
// reset list of fetched shows every 48 hours
setInterval(resetData.reset, 1000 * 60 * 60 * 48);
client.login(process.env.DISCORD_TOKEN);
module.exports.Gbot = client;
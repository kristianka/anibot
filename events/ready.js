const interactionCreate = require("./interactionCreate");

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        const channel = client.channels.cache.get('1060577313256915026');
        channel.send('Online! ✅');
    },
};
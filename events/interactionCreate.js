module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        //console.log("in interactionCreate.js")
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
            const timezone = "Europe/Helsinki"
            const timeFormat = "en-FI";
            const currentTime = () => new Date().toLocaleTimeString(timeFormat, { timeZone: timezone, hour: "2-digit", minute: "2-digit", second: "2-digit" });
            console.log("User", interaction.user.username, "ran /" + interaction.commandName, "at", currentTime());
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    },
};

import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies pong"),

    async execute(interaction) {
        await interaction.reply({ content: "Secret Pong!", ephemeral: true });
    }
};

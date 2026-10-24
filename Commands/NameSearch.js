const { SlashCommandBuilder } = require('discord.js');
const { getGame } = require("../Models/game_model.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('game-search')
        .setDescription('Check games in stock by name')
        .addStringOption(option =>
            option.setName('game-name')
                .setDescription('The name of game to search for')
                .setRequired(true)
        ),

    async execute(interaction) {
    const name = interaction.options.getString('game-name');

    console.log("name requested:", name);

    await interaction.deferReply();

   try {
    const result = await getGame(name);

    console.log("Database result:", result);

    // Game not found or out of stock
    if (typeof result === 'string') {
        return await interaction.editReply(result);
    }

    // Game found and in stock
    if (result) {
        const message =
            `- Name: ${result.Name}, Category: ${result.Category} Price: ${result.Price}, Stock: ${result.Amount_Available}`;

        return await interaction.editReply(message);
    }

    return await interaction.editReply('No games found with this name');

} catch (error) {
        console.error("in stock search error:", error);

        return await interaction.editReply(
            'There was an error searching for games.'
        );
    }
}
};
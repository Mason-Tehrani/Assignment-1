const { SlashCommandBuilder } = require('discord.js');
const { getGameByCategory } = require("../Models/game_model.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('category-search')
        .setDescription('Check games in stock by category')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('The category of games to search for')
                .setRequired(true)
        ),

    async execute(interaction) {
    const category = interaction.options.getString('category');

    console.log("Category requested:", category);

    await interaction.deferReply();

    try {
        const result = await getGameByCategory(category);

        console.log("Database result:", result);

        if (typeof result === 'string') {
            return await interaction.editReply(result);
        }

        if (!result || (Array.isArray(result) && result.length === 0)) {
            return await interaction.editReply('No games found in this category.');
        }

        const games = Array.isArray(result) ? result : [result];

        const message = games
            .filter(game => game.Category === category)
            .map(game =>
                `- Name: ${game.Name}, Price: ${game.Price}, Stock: ${game.Amount_Available}`
            )
            .join('\n');

        return await interaction.editReply(
            message || 'No games found in this category.'
        );

    } catch (error) {
        console.error("Category search error:", error);

        return await interaction.editReply(
            'There was an error searching for games.'
        );
    }
}
};
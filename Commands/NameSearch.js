const { SlashCommandBuilder } = require('discord.js');
const { GamesQuery } = require("../Models/game_model.js");

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
        const result = await GamesQuery(name);

        console.log("Database result:", result);

        if (typeof result === 'string') {
            return await interaction.editReply(result);
        }

        if (!result || (Array.isArray(result) && result.length === 0)) {
            return await interaction.editReply('No games found in this name.');
        }

        const games = Array.isArray(result) ? result : [result];

        const message = games
            .filter(game => game.Name === Name)
            .map(game =>
                `- Name: ${game.Name},Category: ${game.Price} Price: ${game.Price}, Stock: ${game.Amount_Available}`
            )
            .join('\n');

        return await interaction.editReply(
            message || 'No games found with a similar name to query parameter.'
        );

    } catch (error) {
        console.error("Name search error:", error);

        return await interaction.editReply(
            'There was an error searching for games.'
        );
    }
}
};
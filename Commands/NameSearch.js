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
            const results = await GamesQuery(name);
            console.log("Database results:", results);

            if (typeof results === 'string') {
                return await interaction.editReply(results);
            }

            const message = results
                .map(game =>
                    `- Name: ${game.Name}, Category: ${game.Category}, Price: ${game.Price}, Stock: ${game.Amount_Available}`
                )
                .join('\n');

            return await interaction.editReply(
                message || 'No games found with this name.'
            );

        } catch (error) {
            console.error("Game search error:", error);

            return await interaction.editReply(
                'There was an error searching for games.'
            );
        }
    }
};
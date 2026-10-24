const { SlashCommandBuilder } = require('discord.js');
const { checkGameStock } = require("../Models/game_model.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('instock')
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
    const result = await checkGameStock(name);

    console.log("Database result:", result);

    // Game not found or out of stock
    if (typeof result === 'string') {
        return await interaction.editReply(result);
    }

    // Game found and in stock
    if (result && result.Amount_Available > 0) {
        const message =
            `- Name: ${result.Name}, Price: ${result.Price}, Stock: ${result.Amount_Available}`;

        return await interaction.editReply(message);
    }

    else if (result && result.Amount_Available == 0) {
        const message =
            `no copies of ${result.Name} are available for sale or to play currently`;

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
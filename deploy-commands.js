const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log("Client ID:", clientId);
console.log("Guild ID:", guildId);
console.log("Token exists:", Boolean(token));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if (command.data && typeof command.data.toJSON === 'function') {
        commands.push(command.data.toJSON());
        console.log(`Registered command: ${command.data.name}`);
    } else {
        console.log(`Skipping ${file}: Invalid or empty command file.`);
    }
}

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

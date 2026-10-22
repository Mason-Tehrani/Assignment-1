const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require('express-session');
const mustacheExpress = require('mustache-express');

// Include the mustache engine to help us render our pages
app.engine("mustache", mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

const {Client, GatewayIntentBits} = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
] });

//jasontnt124@gmail.com emergingwebtech bot token
const DiscordBotToken = 'MTU1MDE2NDI5NzIzMjE1ODc0MA.GoC4uw.GGeFUbbKh-rYvH3Jq9RI7QBUotHonR7DAm1YuU'

client.on('interactionCreate', async function(interaction) {
  if (!interaction.isChatInputCommand()) return;

  // handle your slash command, query your database, reply to the user

  io.emit('botactivity', { command: interaction.commandName, time: new Date() });
});

client.login(DiscordBotToken);

// Start the server
var server = app.listen(3000, function() {
        console.log("Server listening...");
})

client.on('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

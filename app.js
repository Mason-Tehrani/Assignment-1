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


const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('interactionCreate', async function(interaction) {
  if (!interaction.isChatInputCommand()) return;

  // handle your slash command, query your database, reply to the user

  io.emit('botactivity', { command: interaction.commandName, time: new Date() });
});

client.login('YOUR_BOT_TOKEN');

http.listen(3000, function() { console.log('Server listening...'); });
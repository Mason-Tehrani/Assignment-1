const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const {  token } = require('./config.json');

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
] });

// Include the mustache engine to help us render our pages
app.engine("mustache", mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/Views');

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        console.log(`Command: ${command.data.name}`);
    } else {
        console.log(`Skipping ${file}: Invalid or empty command file.`);
    }
}

// emergingwebtech bot token
const DiscordBotToken = token

// client.on('interactionCreate', async function(interaction) {
//     console.log("Interaction received:", interaction.commandName);
//   if (!interaction.isChatInputCommand()) return;

//   	const command = client.commands.get(interaction.commandName);

// 	if (!command) return;

// 	try {
// 		await command.execute(interaction);
// 	}catch (error) {
//     console.error("Command execution error:", error);

//     if (interaction.deferred || interaction.replied) {
//         await interaction.editReply({
//             content: 'There was an error while executing this command!'
//         });
//     } else {
//         await interaction.reply({
//             content: 'There was an error while executing this command!',
//             ephemeral: true
//         });
//     }
// }

//   // handle your slash command, query your database, reply to the user

//   io.emit('botactivity', { command: interaction.commandName, time: new Date() });
// });

client.on('interactionCreate', async (interaction) => {

    if (!interaction.isChatInputCommand()) {
        console.log("Not a slash command");
        return;
    }

    console.log("User:", interaction.user.username);

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.log("Command not found in collection");
        return;
    }

    console.log("Executing command...");

    try {
        await command.execute(interaction);
        console.log("Command executed successfully");
    } catch (error) {
        console.error("Execution failed:", error);
    }
});

client.login(DiscordBotToken);

app.use(express.urlencoded({extended: false}));
app.use(session({secret: 'keyboard cat'
                ,resave: false
                ,saveUninitialized:false}))

app.use(function (req, res, next) {
        req.TPL = {};
        req.TPL.displaylogin = !req.session.username;
        req.TPL.displaylogout = req.session.username;

  next();
});

app.use("/home",
    function (req, res, next) { req.TPL.homenav = true; next(); });
app.use("/games",
    function (req, res, next) { req.TPL.gamenav = true; next(); });
app.use("/admin",
    function (req, res, next) { req.TPL.adminnav = true; next(); });
app.use("/login",
    function (req, res, next) { req.TPL.loginnav = true; next(); });

app.get('/', function (req, res) {
    res.redirect('/home');
});

app.use("/home", require("./Controllers/home_controller"));
app.use("/admin", require("./Controllers/admin_controller"));
app.use("/login", require("./Controllers/login_controller"));
app.use("/games", require("./Controllers/game_controller"));

// Start the server
var server = app.listen(3000, function() {
        console.log("Server listening...");
})

client.on('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});



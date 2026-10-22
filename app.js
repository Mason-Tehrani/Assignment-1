const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require('express-session');
const mustacheExpress = require('mustache-express');

// Include the mustache engine to help us render our pages
app.engine("mustache", mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/Views');

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

// We use the .urlencoded middleware to process form data in the request body,
// which is something that occurs when we have a POST request.
app.use(express.urlencoded({extended: false}));

// Use the session middleware
app.use(session({secret: 'keyboard cat'
                ,resave: false
                ,saveUninitialized:false}))

// Create a middleware to populate an initial template arra
app.use(function (req, res, next) {

        // reset the template obect to a blank object on each request
        req.TPL = {};

        // decide whether to display the login or logout button in the navbar
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

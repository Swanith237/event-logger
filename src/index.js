require('dotenv').config();
const { Client, Collection, Events } = require(`discord.js`);
const fs = require('fs');
const c = require('../colors');

const client = new Client({ intents: 32767 + 256 });

client.commandArray = [];
client.eventArray = [];
client.commands = new Collection();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleCommands(commandFolders, "./src/commands");
    client.handleEvents(eventFiles, "./src/events");

    const { eventArray, commandArray } = client;

    console.log(`\nTotal Number of Events: ${c.bright}${eventArray.length}${c.reset}`);
    console.log(`Total Number of Commands: ${c.bright}${commandArray.length}${c.reset}\n`);

    client.login(process.env.token);
})();
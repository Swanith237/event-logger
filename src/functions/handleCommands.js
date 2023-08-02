require('dotenv').config();
const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const c = require('../../colors');

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        console.log(c.fg.yellow + c.bright + '\n[Console] > Bot is Starting...' + c.reset);
        const { commands, commandArray } = client;

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));

            console.log(`\n => ${folder.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} - Commands`);
            if (commandFiles.length < 1) {
                console.log(c.fg.yellow + 'No Commands Found' + c.reset);
            };

            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);

                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());

                console.log(`[Command] > ` + c.fg.yellow + c.bright + command.data.name + c.reset + ` has successfully passed through the Command Handler.`);
            };
        };

        const rest = new REST({ version: '10' }).setToken(process.env.token);

        (async () => {
            try {
                console.log(c.fg.yellow + c.bright + '[Bot] > Refreshing Application Commands...' + c.reset);

                await rest.put(
                    Routes.applicationGuildCommands(process.env.clientID, process.env.guildID), {
                        body: client.commandArray
                    }
                );

                console.log(c.fg.yellow + c.bright + '[Bot] > Successfully Reloaded Application Commands.' + c.reset);
            } catch (error) {
                console.error(error);
            };
        })();
    };
};
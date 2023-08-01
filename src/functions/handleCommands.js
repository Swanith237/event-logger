const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const clientID = '1065034535558983741'; 
const guildID = '1135541650165334086'; 

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            };
        };

        const rest = new REST({ version: '10' }).setToken(process.env.token);

        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');

                await rest.put(
                    Routes.applicationGuildCommands(clientID, guildID), {
                        body: client.commandArray
                    }
                );

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            };
        })();
    };
};
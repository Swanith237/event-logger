const fs = require('fs');
const c = require('../../colors');

module.exports = (client) => {
    client.handleEvents = async () => {
        const eventFolders = fs.readdirSync('./src/events');
        const { eventArray } = client;

        for (const folder of eventFolders) {
            const eventFiles = fs.readdirSync(`./src/events/${folder}`).filter((file) => file.endsWith('.js'));

            console.log(`\n => ${folder.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} - Events`);
            if (eventFiles.length < 1) {
                console.log(c.fg.yellow + 'No Events Found' + c.reset);
            };

            for (const file of eventFiles) {
                const event = require(`../events/${folder}/${file}`);
                eventArray.push(event.name);
    
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                };
    
                console.log(`[Event] > ` + c.fg.green + c.bright + event.name + c.reset + ` has successfully passed through the Event Handler.`);
            };
        };
    };
};
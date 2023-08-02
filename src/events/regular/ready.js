const c = require('../../../colors');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        await client.channels.cache.get('1135541729316049017').send(`I'm Online!`);
        console.log(`${c.fg.cyan}${c.bright}\n[${client.user.tag}] > I have Logged In and I'm now ready to use!${c.reset}\n`);
    },
};
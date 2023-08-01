module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Ready!');
        console.log(`Successfully Logged in as ${client.user.tag}`);
    },
};
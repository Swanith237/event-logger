const { SlashCommandBuilder, Events, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('events')
        .setDescription('Get all the events available to log.'),

    async execute(interaction, client) {
        const events = Object.keys(Events);

        const eventsArray = [];
        events.forEach((event, index) => {
            eventsArray.push(` \`${index}: ${event}\` `);
        });

        const eventsEmbed = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTitle('Events Available')
            .setDescription(`\`${eventsArray.join('\n')}\``)
            .setTimestamp();

        await interaction.reply({
            // content: `Here are the available events: \n\n${eventsArray.join('\n')}`
            embeds: [eventsEmbed]
        });
    }
};
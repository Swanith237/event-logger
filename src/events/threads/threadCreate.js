require('dotenv').config();
const { Events, AuditLogEvent, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.ThreadCreate,
    async execute(channel, client) {
        const logChannel = await channel.guild.channels.cache.get(process.env.logChannel);

        channel.guild.fetchAuditLogs({
            type: AuditLogEvent.ThreadCreate
        }).then(async (audit) => {
            const { executor } = audit.entries.first();
            let type = channel.type;

            if (type === 10) type = 'Announcement Thread';
            if (type === 11) type = 'Public Thread';
            if (type === 12) type = 'Private Thread';

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setAuthor({
                    name: executor.username,
                    iconURL: executor.displayAvatarURL()
                })
                .setTitle('Thread Created')
                .setDescription('New Event Triggered: `Thread-Create`')
                .addFields([
                    { name: 'Thread', value: `#${channel.name}`, inline: true },
                    { name: `Type`, value: type, inline: true },
                    { name: `Thread ID`, value: channel.id, inline: false },
                    { name: `Creator`, value: `${executor.username} (<@${executor.id}>)`, inline: true }
                ])
                .setTimestamp();

            await logChannel.send({
                embeds: [embed]
            });
        })
    }
};
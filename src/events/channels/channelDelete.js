require('dotenv').config();
const { Events, AuditLogEvent, EmbedBuilder } = require('discord.js')

module.exports = {
    name: Events.ChannelDelete,
    async execute(channel, client) {
        const logChannel = await channel.guild.channels.cache.get(process.env.logChannel);

        channel.guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelDelete
        }).then(async (audit) => {
            const { executor } = audit.entries.first();
            let type = channel.type;

            if (type === 0) type = 'Text';
            if (type === 2) type = 'Voice';
            if (type === 4) type = 'Category';
            if (type === 5) type = 'Announcement';
            if (type === 13) type = 'Stage';
            if (type === 15) type = 'Forum';

            const embed = new EmbedBuilder()
                .setColor(0xe80e0e) // Red
                .setAuthor({
                    name: executor.username,
                    iconURL: executor.displayAvatarURL()
                })
                .setTitle(type === 'Category' ? "Category Deleted" : "Channel Deleted")
                .setDescription(`New Event Triggered: ${type === 'Category' ? '`Category-Delete`' : '`Channel-Delete`'}`)
                .addFields([
                    { name: type === 'Category' ? "Category" : "Channel", value: `#${channel.name}`, inline: true },
                    { name: `Type`, value: type, inline: true },
                    { name: type === 'Category' ? "Category ID" : "Channel ID", value: channel.id, inline: false },
                    { name: `Deleted By`, value: `${executor.username} (<@${executor.id}>)`, inline: true }
                ])
                .setTimestamp();

            await logChannel.send({ 
                embeds: [embed]
            });
        })
    }
}
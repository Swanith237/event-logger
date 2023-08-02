require('dotenv').config();
const { Events, AuditLogEvent, EmbedBuilder } = require('discord.js')

module.exports = {
    name: Events.ChannelCreate,
    async execute(channel, client) {
        const logChannel = await channel.guild.channels.cache.get(process.env.logChannel);

        channel.guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelCreate
        }).then(async (audit) => {
            const { executor } = audit.entries.first();
            let type = channel.type;

            if (type === 0) type = 'Text Channel';
            if (type === 2) type = 'Voice Channel';
            if (type === 4) type = 'Category';
            if (type === 5) type = 'Announcement';
            if (type === 13) type = 'Stage';
            if (type === 15) type = 'Forum';

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setAuthor({
                    name: executor.username,
                    iconURL: executor.displayAvatarURL()
                })
                .setTitle(type === 'Category' ? "Category Created" : "Channel Created")
                .setDescription(`New Event Triggered: ${type === 'Category' ? '`Category-Create`' : '`Channel-Create`'}`)
                .addFields([
                    { name: type === 'Category' ? "Category" : "Channel", value: type === 4 ? `#${channel.name}` : `#${channel.name} (<#${channel.id}>)`, inline: true },
                    { name: `Type`, value: type, inline: true },
                    { name: type === 'Category' ? "Category ID" : "Channel ID", value: channel.id, inline: false },
                    { name: `Creator`, value: `${executor.username} (<@${executor.id}>)`, inline: true }
                ])
                .setTimestamp();

            await logChannel.send({ 
                embeds: [embed]
            })
        })
    }
}
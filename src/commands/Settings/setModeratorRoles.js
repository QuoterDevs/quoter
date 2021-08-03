const { MessageEmbed } = require('discord.js')
const cfg = require('../../Struct/cfg.json');

module.exports = {
    name: 'moderator',
    aliases: [ 'modrole', 'mod' ],
    args: true,
    usage: {
        ru: '<роль/роли>',
        eng: '<role/roles>'
    },
    description: {
        ru: 'Установить указанные роли как модераторские',
        eng: 'Set provided roles as moderators'
    },
    permissions: {
        member: ['MANAGE_GUILD'],
    },
    async execute(client, message, args) {
        const guild = client.cache.getGuild(message.guild.id);
        let roles = message.mentions.roles.filter(x => !x.managed &&
            x.position < message.guild.me.roles.highest.position).map(x => x.id) ||
            args[0]
        if(message.guild.roles.cache.get(args[0])) {
            roles = [ args[0] ];
        }
    let setRoles = [];
        const errorEmbed = new MessageEmbed()
            .setTitle(client.lang[guild.lang]['global']['error'])
            .setColor(cfg.colors.error)

        for(const role of roles) {
            if(guild.moderator && guild.moderator.roles.includes(role)) {
                errorEmbed
                    .setDescription(client.lang[guild.lang][this.name]['included'].replace('%role%', `<@&${role}>`))
                return message.channel.send(errorEmbed)
            }
        }
        if(roles instanceof Array && !roles.length) {
            const reply = client.lang[guild.lang]['global']['noArgs'].replace('%usage%', `${guild.prefix}${this.name} ${this.usage[guild.lang]}`);
            errorEmbed
                .setDescription(reply)
                .setThumbnail(message.author.displayAvatarURL({ size: 1024, animated: true }))
            return message.channel.send(errorEmbed);
        }
for(const role of roles) {
    setRoles.push(role);
}

    if(guild.moderator && guild.moderator.roles) {
        for(const role of setRoles) {
            guild.moderator.roles.push(role);
        }
    } else {
        guild.moderator = {
            roles: setRoles
        }
    }

    await client.db.guilds.updateOne({
        guildID: message.guild.id
    }, {
        $set: {
            moderator: {
                roles: guild.moderator.roles
            }
        }
    })
        message.channel.send(client.lang[guild.lang][this.name]['updated']);

    }
}
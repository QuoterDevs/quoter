const { MessageEmbed } = require('discord.js');
const cfg = require('../../Struct/cfg.json');
let allowed = [
    '~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '-', '_', '=', '+',
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
    'z', 'x', 'c', 'v', 'b', 'n', 'm',
    '[', '{', ']', '}', '!', '$', '%', '^', '&', '*', '.', ',', '?'
]

module.exports = {
    name: 'prefix',
    args: true,
    aliases: [ 'pref' ],
    usage: {
        ru: '<префикс>',
        eng: '<prefix>'
    },
    description: {
        ru: 'Команда которая сменит префикс на сервере',
        eng: 'Command which changes guild\'s prefix'
    },
    permissions: {
        member: [ 'MANAGE_GUILD' ]
    },
    async execute(client, message, args) {
        let str = args[0];
        let letters = str.toLowerCase().split('');

        const guild = client.cache.getGuild(message.guild.id);
        const errorEmbed = new MessageEmbed()
            .setTitle(client.lang[guild.lang]['global']['error'])
            .setColor(cfg.colors.error)
            .setThumbnail(message.author.displayAvatarURL({ size: 1024, dynamic: true }))
        if(args[0].length > 5) {
                errorEmbed.setDescription(client.lang[guild.lang][this.name]["prefixToLong"]);
            return message.channel.send(errorEmbed);
        }

        for( const letter of letters ) {
            if (!allowed.includes(letter)) {
                errorEmbed.setDescription(client.lang[guild.lang][this.name]["invalidSymbol"].replace('%letter%', letter.replace('`', '\`')));
                return message.channel.send(errorEmbed);
            }
        }

        if(guild.prefix === args[0]) {
            errorEmbed.setDescription(client.lang[guild.lang][this.name]["samePrefix"]);
            return message.channel.send(errorEmbed);
        }

    message.channel.send(client.lang[guild.lang][this.name]["success"])

        guild.prefix = args[0]
        await client.db.guilds.updateOne({
            guildID: message.guild.id
        }, {
            $set: {
                prefix: args[0]
            }
        })
        
    }
}
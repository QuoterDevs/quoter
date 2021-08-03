let allowed = [
    '~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '_', '=', '+',
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
    'z', 'x', 'c', 'v', 'b', 'n', 'm',
    '[', '{', ']', '}', '(', ')', '!',
    '@', '#', '$', '%', '^', '&', '*',
    '.', ',', '?', '/', '|', '\\', '"', '\'', '<', '>',
    'й', 'ц', 'у', 'к', 'е', 'н',
    'г', 'ш', 'щ', 'з', 'ф', 'ы',
    'в', 'а', 'п', 'р', 'о', 'л',
    'д', 'з', 'х', 'ъ', 'ж', 'э',
    'я', 'ч', 'с', 'м', 'и', 'т',
    'ь', 'б', 'ю', 'і', 'ъ', 'ї', ' ', 'ё'
]

const { MessageEmbed } = require('discord.js');
const cfg = require('../../struct/cfg.json');

module.exports = {
    name: 'correct',
    aliases: [ 'c', 'correctall', 'ca' ],
    description: {
        ru: 'Исправление никнеймов всех участников сервера',
        eng: 'Correction guild members nicknames'
    },
    permissions: {
        member: [ 'MANAGE_NICKNAMES' ],
        bot: [ 'MANAGE_NICKNAMES' ]
    },
    async execute(client, message) {
        const guild = client.cache.getGuild(message.guild.id);
        if(!guild.corrector || !guild.corrector.enabled) {
            const errorEmbed = new MessageEmbed()
                .setTitle(client.lang[guild.lang]['global']['error'])
                .setColor(cfg.colors.error)
                .setThumbnail(message.guild.iconURL({ size: 1024, dynamic: true }))
                .setDescription(client.lang[guild.lang][this.name]['disabled'])
            return message.channel.send(errorEmbed)
        }

        const members = message.guild.members.cache.filter(x =>
            x.id !== message.guild.owner.id &&
            !x.user.bot &&
            x.roles.highest.position < message.guild.me.roles.highest.position).map(x => x)
        let changed = 0;
        for(const member of members) {
            let letters = member.displayName.split('');
            let name = '';
            for (const letter of letters) {
                if(allowed.includes(letter.toLowerCase())) {
                    name += letter;
                }
            }
            if(name !== member.displayName) {
                try {
                    if(!name.split(' ').join('').length) {
                        await member.setNickname('name');
                        changed++;
                    } else {
                        await member.setNickname(name);
                        changed++;
                    }
                } catch {

                }
            }
        }
        if(!changed) return message.channel.send(client.lang[guild.lang][this.name]['noOne']);

        message.channel.send(client.lang[guild.lang][this.name]['launched'].replace('%count%', changed));
    }
}
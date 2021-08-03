const { MessageEmbed } = require("discord.js");
const cfg = require('../../Struct/cfg.json');
const { readdirSync } = require('fs');

module.exports = {
    name: 'help',
    usage: {
        ru: '[команда]',
        eng: '[command]'
    },
    aliases: [ 'h' ],
    description: {
        ru: 'Команда, выводящая список команд или справку конкретной команды',
        eng: 'Command, which show commands list or reference of provided command'
    },
    execute(client, message, args) {
        const guild = client.cache.getGuild(message.guild.id);
        const embed = new MessageEmbed()
        .setThumbnail(client.user.displayAvatarURL({ size: 1024}))
        .setColor(cfg.colors.ok)

    if(args[0]) {
        const command = client.commands.get(args[0]) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));

        const errorEmbed = new MessageEmbed()
            .setTitle(client.lang[guild.lang]['global']['error'])
            .setDescription(client.lang[guild.lang][this.name]['noCommand'])
            .setColor(cfg.colors.error)
            .setThumbnail(message.author.displayAvatarURL({ size: 1024, dynamic: true }))
        if(!command || command.dir === 'Dev') return message.channel.send(errorEmbed)
const fields = client.lang[guild.lang][this.name]['fields']
        embed
            .setTitle(client.lang[guild.lang][this.name]['titleArgs'].replace('%command%', command.name))
            .setDescription(client.lang[guild.lang][this.name]['descriptionArgs'])
            .addField(fields[1], '>>> ' + command.description[guild.lang])

            if(command.aliases) embed.addField(fields[0], '>>> ' + command.aliases.map(cmd => `\`${cmd}\``).join(', '), true)
            if(command.usage) embed.addField(fields[2], '>>> '  + command.usage[guild.lang], true)
            if(cfg.cooldowns[command.name]) embed.addField(fields[3], '>>> ' + String(cfg.cooldowns[command.name]), true)
        return message.channel.send(embed)
    }
        embed
            .setTitle(client.lang[guild.lang][this.name]['titleNoArgs'])
            .setDescription(client.lang[guild.lang][this.name]['descriptionNoArgs'].replace('%prefix%', guild.prefix))

        const CommandsDirs = readdirSync('./src/commands');
            
        CommandsDirs.forEach(dir => {
            const cmds = client.commands.filter(cmd => cmd.dir === dir && cmd.dir !== 'Dev');
            if(cmds.size) {
                embed.addField(dir, cmds.map(cmd => `\`${cmd.name}\``).join(', '));
            }
        })
            void message.channel.send(embed);
    }
}
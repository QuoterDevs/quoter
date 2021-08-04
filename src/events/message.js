const { MessageEmbed, DiscordAPIError } = require('discord.js');
const cfg = require('../struct/cfg.json');
const { cooldown } = require('../struct/managers/cooldownManager');

module.exports = async(client, eventName, message) => {
    if(message.author.bot || message.channel.type === 'dm') return;

    const guild = client.cache.getGuild(message.guild.id);
    const user = client.cache.getUser(message.author.id);

    const prefixes = [ `<@!${client.user.id}>`, `<@${client.user.id}>`, guild.prefix ];
    if(user && user.prefix) prefixes.push(user.prefix);

    const MentionRegex = new RegExp(String.raw`^<@!?${client.user.id}>$`)

    if(message.content.match(MentionRegex)) {
        return message.channel.send(
            client.lang[guild.lang]['global']['ping']
                .replace(/%prefix%/g, guild.prefix)
                .replace('%bot%', client.user.toString()))
    }
    let prefix;
    for(const pref of prefixes) {
        if(message.content.toLowerCase().startsWith(pref)) {
            prefix = pref;
            break;
        }
    }
    if (!prefix) return;


    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if(!command) return;

    if(args[0] === '?') return client.commands.get('help').execute(client, message, [ command.name ]);

    if(command.dir === 'Dev' && message.author.id !== '607148903833403422') return;

    const errorEmbed = new MessageEmbed()
        .setTitle(client.lang[guild.lang]['global']['error'])
        .setColor(cfg.colors.error)

    const perm = await require('../struct/managers/permissionCheckerManager')(client, message, command, errorEmbed)
    if(!perm["message"]) {
        return message.channel.send(perm["embed"]);
    }

    if(command.args && !args.length) {
        const reply = client.lang[guild.lang]['global']['noArgs'].replace('%usage%', `${prefix}${commandName} ${command.usage[guild.lang]}`);
        errorEmbed
            .setDescription(reply)
            .setThumbnail(message.author.displayAvatarURL({ size: 1024, animated: true }))
        return message.channel.send(errorEmbed);
    }
    const check = await cooldown(client, message, command);
    if(!check.message) {

        errorEmbed
            .setDescription(client.lang[guild.lang]['global']['cooldown'].replace('%time%', check.time))
            .setThumbnail(message.author.displayAvatarURL({ size: 1024, animated: true }))

        return message.channel.send(errorEmbed);
    }

    if(command.permissions && command.permissions.bot && !message.guild.me.permissions.has(command.permissions.bot)) {

        const perms = command.permissions.bot.map(perm =>
            `\`${client.permissions[guild.lang][perm]}\``
        ).join(', ')
        errorEmbed
            .setDescription(client.lang[guild.lang]['global']['noPermsBot'].replace('%perms%', perms))
            .setThumbnail(client.user.displayAvatarURL({ size: 1024, animated: true }))

        return message.channel.send(errorEmbed)
    }
    try {
        command.execute(client, message, args);
        client.stats.commands++;
    } catch(e) {
        if (e instanceof DiscordAPIError) {
            return message.channel.send(client.lang[guild.lang].global.errors.api);
        }
        message.channel.send(client.lang[guild.lang].global.errors.default);
        console.log(e);
    }

}
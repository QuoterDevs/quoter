const { MessageEmbed } = require('discord.js');
const cfg = require('../../Struct/cfg.json');
const langJson = {
    ru: 'Русский',
    eng: 'English'
}
const enableChecker = {
    true: {
        ru: 'Включён',
        eng: 'Enabled'
    },
    false: {
        ru: 'Выключен',
        eng: 'Disabled'
    }
}

module.exports = {
    name: 'settings',
    aliases: [ 'config' ],
    description: {
        ru: 'Текущие настройки сервера',
        eng: 'Current server settings'
    },
    execute(client, message) {
    const guild = client.cache.getGuild(message.guild.id);
    const user = client.cache.getUser(message.author.id);

    const lang = client.lang[guild.lang][this.name];

    const emb = new MessageEmbed()
        .setTitle(lang['title'].replace('%guildName%', message.guild.name))
        .setColor(cfg.colors.ok)
        .setThumbnail(message.guild.iconURL({
            dynamic: true, size: 1024
        }))

        .addField(lang['prefix'], '>>> ' + guild.prefix, true)
        .addField(lang['lang'], '>>> ' + langJson[guild.lang], true)

        if(guild.moderator) emb.addField(lang['roles'], '>>> ' + guild.moderator.roles.map(x => `<@&${x}>`).join(', '), true)
        if(guild.voice) emb.addField(lang['private'], '>>> ' + enableChecker[guild.voice.enabled][guild.lang], true)
        if(guild.corrector) emb.addField(lang['corrector'], '>>> ' + enableChecker[guild.corrector.enabled][guild.lang], true)
        if(user && user.prefix) emb.addField(lang['userPrefix'], '>>> ' + user.prefix, true)
        void message.channel.send(emb)

    },
}
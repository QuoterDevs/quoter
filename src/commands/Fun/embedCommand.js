const { MessageEmbed } = require('discord.js'); 
const cfg = require('../../Struct/cfg.json');

module.exports = {
    name: 'embed',
    args: true,
    aliases: [ 'emb' ],
    usage: {
        ru: '<Объект эмбеда>',
        eng: '<Embed\'s object>'
    },
    description: {
        ru: 'Команда, позволяющая отправить эмбед в чат',
        eng: 'Sends provided embed to the channel'
    },
    permissions: {
        member: [ "MANAGE_MESSAGES" ],
        bot: [ "MANAGE_MESSAGES" ]
    },
    async execute(client, message, args) {
    const guild = client.cache.getGuild(message.guild.id)

        try {
            let text = args.join(' ');
            let json = JSON.parse(text);
            await message.channel.send({embed: json});
            message.delete();

    } catch(e) {

        message.delete();

        const embed = new MessageEmbed()
            .setTitle(client.lang[guild.lang]['global']['error'])
            .setColor(cfg.colors.error)
            .setThumbnail(message.author.displayAvatarURL({ size: 1024, animated: true }))
            .setDescription(e)
        return message.channel.send(embed);

        }
    }
}
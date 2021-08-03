module.exports = {
    name: 'language',
    aliases: [ 'lang' ],
    description: {
        ru: 'Сменить язык интерфейса на сервере',
        eng: 'Change guilds\'s interface language'
    },
    permissions: {
        member: [ 'MANAGE_GUILD' ]
    },
    execute(client, message) {
        const guild = client.cache.getGuild(message.guild.id);

        if(guild.lang === 'ru') {
            let lang = 'eng';
            void client.db.guilds.updateOne({
                guildID: message.guild.id
            }, {
                $set: {
                    lang: lang
                }
            })
            guild.lang = lang;
            message.channel.send(client.lang[guild.lang][this.name]['changed']);
        } else {
            let lang = 'ru';
            void client.db.guilds.updateOne({
                guildID: message.guild.id
            }, {
                $set: {
                    lang: lang
                }
            })
            guild.lang = lang;
            message.channel.send(client.lang[guild.lang][this.name]['changed']);
        }
    }
}
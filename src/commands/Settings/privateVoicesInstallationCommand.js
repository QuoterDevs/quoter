module.exports = {
    name: 'private',
    aliases: [ 'voice', 'voices' ],
    description: {
        ru: 'Команда, созданная для включения/выключения модуля приватных комнат',
        eng: 'Command, which turns on/off private voice rooms'
    },
    permissions: {
        member: [ 'MANAGE_GUILD' ],
        bot: [ 'MANAGE_CHANNELS', 'MOVE_MEMBERS' ]
    },
    async execute(client, message) {
        const guild = client.cache.getGuild(message.guild.id);
        async function createVoice() {
            let { id: id1 } = await message.guild.channels.create(
                client.lang[guild.lang]['private']['categoryName'],
                {
                    type: 'category'
                }
            )


            let { id: id2 } = await message.guild.channels.create(
                client.lang[guild.lang]['private']['channelName'],
                {
                    type: 'voice',
                    parent: id1
                }
            )
                .then(channel => channel.setUserLimit(1));
            message.channel.send(client.lang[guild.lang]['private']["created"]);
            const json = {
                enabled: true,
                category: id1,
                channel: id2
            }

            await client.db.guilds.updateOne({
                guildID: message.guild.id
            }, {
                $set: {
                    voice: json
                }
            })


            guild.voice = json;
        }
        if(!guild.voice) {
            await createVoice();
            return;
            }
            
            if(!message.guild.channels.cache.get(guild.voice.channel) ||
                !message.guild.channels.cache.get(guild.voice.category)) {
                    await createVoice();
                    return;
        }

        if(guild.voice.enabled) {

            await client.db.guilds.updateOne({
                guildID: message.guild.id
            }, {
                $set: {
                    voice: {
                        channel: guild.voice.channel,
                        category: guild.voice.category,
                        enabled: false
                    }
                }
            })
            guild.voice.enabled = false;

            message.channel.send(client.lang[guild.lang]['private']["disabled"]);

        } else {

            await client.db.guilds.updateOne({
                guildID: message.guild.id
            }, {
                $set: {
                    voice: {
                        channel: guild.voice.channel,
                        category: guild.voice.category,
                        enabled: true
                    }
                }
            })
            guild.voice.enabled = true;

            message.channel.send(client.lang[guild.lang]['private']["enabled"]);

        }
    }
}
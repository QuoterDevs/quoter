const fetch = require('node-fetch');

module.exports = {
    name: 'bump',
    aliases: [ 'like', 'up' ],
    description: {
        ru: 'Апнуть сервер на мониторинге серверов BotiCord',
        eng: 'Up server on BotiCord monitoring'
    },
    async execute(client, message) {

        fetch('https://api.boticord.top/v1/server', {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'Authorization': process.env.BOTICORD
            },
            body: JSON.stringify({
                serverID: message.guild.id,
                up: 1,
                status: 1,
                serverName: message.guild.name,
                serverAvatar: message.guild.iconURL({ size: 1024, dynamic: true }),
                serverMembersAllCount: message.guild.memberCount,
                serverMembersOnlineCount: message.guild.members.cache.filter(x => x.presence.status === 'online').size,
                serverOwnerID: message.guild.owner.id
            })
        })
            .then(r => r.json())
            .then(res => {
                message.channel.send(res.message)
            })
            .catch(() => message.channel.send('Произошла ошибка во время запроса'))
    }
}
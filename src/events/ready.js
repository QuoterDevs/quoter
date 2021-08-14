const fetch = require('node-fetch');

module.exports = async(client, eventName) => {

    client.user.setPresence({ activity: { name: `default prefix: ${process.env.PREFIX} | Shard: ${client.shard.ids[0]}`, type: 'LISTENING' }, status: 'idle' })
        .then(console.log(`${eventName} | ✅ Successfully set presence`))
        .catch(console.error);

    setTimeout(async () => {

        let guilds = await client.db.guilds.find({
            guildID: { $in: client.guilds.cache.map(x => x.id) }})
            .toArray();
        let users = await client.db.users.find().toArray();
        function cache() {
            for (const guild of guilds) {
                client.cache.guilds.set(guild.guildID, guild);
            }
            for (const user of users) {
                client.cache.users.set(user.userID, user);
            }
        }
            cache();
        while (!guilds || !users) {
            let guilds = await client.db.guilds.find({
                guildID: { $in: client.guilds.cache.map(x => x.id) }})
                .toArray();
            cache();
        }
        console.log(`${eventName} | ✅ Cached ${guilds.length} guilds`);
        console.log(`${eventName} | ✅ Cached ${users.length} users`);
    }, 3000);

    let totalGuilds, totalMembers, shards;

    const promises = [
        await client.shard.fetchClientValues('guilds.cache.size'),
        await client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
        await client.shard.broadcastEval('this.ws.ping')
    ];
    await Promise.all(promises)
        .then(results => {
            totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
            totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
            shards = results[2].length
        });
try {
    if (process.env.BOTICORD && client.user.id === '736963755904335942') {
        fetch("https://boticord.top/api/stats", {
            method: 'POST',
            headers: {
                'Authorization': process.env.BOTICORD,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                servers: totalGuilds,
                shards: shards,
                users: totalMembers
            })
        }).then(r => r.json()).then(console.info).catch(console.log);
    }

    if (process.env.SDC && client.user.id === '736963755904335942') {
        fetch("https://api.server-discord.com/v2/bots/736963755904335942/stats", {
            method: 'POST',
            headers: {
                'Authorization': process.env.SDC,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                servers: totalGuilds,
                shards: shards
            })
        }).then(r => r.json()).then(console.info).catch(console.log);
    }
} catch {}
}
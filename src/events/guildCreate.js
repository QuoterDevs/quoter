module.exports = async (client, eventName, guild) => {
    const cacheGuild = client.cache.get(guild.id);
    if(!cacheGuild) {
        const mongoGuild = await client.db.guilds.findOne({
            guildID: guild.id
        })
        if(!mongoGuild) {
            const json = {
                prefix: process.env.PREFIX,
                lang: 'eng'
            }
            client.db.guilds.insertOne({
                guildID: guild.id,
                prefix: process.env.PREFIX,
                lang: 'eng'
            })
            client.cache.guilds.set(guild.id, json)
            console.log(`${eventName} | ✅ Registered ${guild.id} guild`)
        }
    }
}
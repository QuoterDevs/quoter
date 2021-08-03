const { Collection } = require('discord.js');

class CacheManager {
    constructor() {
        this.guilds = new Collection();
        this.users = new Collection();
    }

    getUser(id) {
        const user = this.users.get(id);
        return user ? user : null;
    }
    getGuild(id) {
        const guild = this.guilds.get(id);
        return guild ? guild : null;
    }
    getMember(guild, user) {
        const member = this.guilds.get(guild);
        if(!guild) return null;
        return guild.members[user] ? guild.members[user] : null;
    }
}

module.exports = CacheManager
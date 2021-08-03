const { Client, Collection, Intents } = require('discord.js');
const CacheManager = require('./managers/cacheManager');

module.exports = class extends Client {
    constructor(config) {
        super({
            disableMentions: 'everyone',
            messageCacheLifetime: 500,
            messageSweepInterval: 1000,
            messageCacheMaxSize: 20,
            messageEditHistoryMaxSize: 1,
            ws: {
                intents: Intents.ALL
            }
        });
        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.cache = new CacheManager();
        this.stats = { events: 0, commands: 0 };
        this.config = config;
        this.lang = {
            ru: require('./cfg/lang-ru.json'),
            eng: require('./cfg/lang-eng.json')
        };
        this.permissions = {
            ru: require('./cfg/perms-ru.json'),
            eng: require('./cfg/perms-eng.json')
        }
    }
}
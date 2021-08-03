const { ShardingManager } = require('discord.js');

module.exports = class extends ShardingManager {
    constructor(config) {
        super('./src/struct/sharding/Shard.js', config);
    }
}
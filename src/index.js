require('dotenv').config();

const QuoterSharding = require('./struct/sharding/ShardManager');
const manager = new QuoterSharding({ totalShards: 'auto', timeout: -1, token: process.env.TOKEN });

manager.on('shardCreate', shard => {
    console.log(`ShardManager | Launched shard ${shard.id}`);
});

void manager.spawn();
require('dotenv').config();
const QuoterClient = require('../Client');

const client = new QuoterClient({ token: process.env.TOKEN, prefix: process.env.PREFIX });

require('../Handlers/eventsHandler')(client);
require('../Handlers/commandsHandler')(client);
require('../MongoClient')(client);

void client.login(client.config.token);
console.log(`✅ Launched`);
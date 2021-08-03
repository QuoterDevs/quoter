const { MongoClient } = require('mongodb');

module.exports = async (client) => {
    new Promise(async (res) => {
      await MongoClient.connect(process.env.MONGO, {useNewUrlParser: true, useUnifiedTopology: true}, async (err, dbClient) => {
            if(err) {
                return console.log(`[DATA_BASE] Error! Failed connect to MongoDB!\n${err.name}\n${err.message}`);
            }
            const db = dbClient.db(process.env.DB);
            client.db = {
                client: dbClient,
                db: db,
                guilds: db.collection('guilds'),
                users: db.collection('users')
            }
            console.log("mongodb | ✅ Connected to Database");
            res();
        })
        
    })
    
}
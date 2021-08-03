const { readdirSync } = require('fs');

module.exports = async(client) => {
    const eventsFiles = readdirSync('./src/events')
        .filter(file => file.endsWith(".js"));

    if(!eventsFiles.length) return console.log('EventHandler | ❌ No events were found');

        eventsFiles.forEach(file => {
            const event = require(`../../events/${file}`);
            let eventName = file.split(".")[0];

            client.on(eventName, (...args) => {
                event.bind(null, client, eventName, ...args)();
                client.stats.events++;
            });
            delete require.cache[require.resolve(`../../events/${file}`)];

            console.log(`EventHandler | ✅ Loaded ${eventName} event`);
        })
}
const fetch = require('node-fetch');

module.exports = {
    name: 'djs',
    aliases: [ 'docs' ],
    usage: {
        ru: '[версия] <запрос>',
        eng: '[version] <request>'
    },
    args: true,
    description: {
        ru: 'Информация по указанному запросу из документации Discord.js',
        eng: 'Information for provided request from Discord.js docs'
    },
    async execute(client, message, args) {
    const guild = client.cache.getGuild(message.guild.id);
        try {
            let version = args[0].toLowerCase();
            let available = ['master', 'stable'];
            let param = args[1];
            if(!available.includes(version)) {
                version = 'stable';
                param = args[0];
            }
            let emb = await fetch( `https://djsdocs.sorta.moe/v2/embed?src=${version}&q=${encodeURIComponent([param])}`)
                .then(r => r.json())
            void await message.channel.send({embed: emb})
        } catch {
    message.channel.send(client.lang[guild.lang][this.name]['requestError']);
        }
    }
}
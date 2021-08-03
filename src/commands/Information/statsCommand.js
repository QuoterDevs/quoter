const { MessageEmbed } = require('discord.js');
const cfg = require('../../struct/cfg.json');
function count(number) {
    let rez = Math.round(number);
    return (rez + '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
}
function uptimer(ms){
    let weeks = Math.floor(ms / 604800000); // 7*24*60*60*1000
    let weeksms = ms % 604800000; // 7*24*60*60*1000
    let days = Math.floor(weeksms / 86400000); // 24*60*60*1000
    let daysms = ms % 86400000; // 24*60*60*1000
    let hours = Math.floor(daysms / 3600000); // 60*60*1000
    let hoursms = ms % 3600000; // 60*60*1000
    let minutes = Math.floor(hoursms / 60000); // 60*1000
    let minutesms = ms % 60000; // 60*1000
    let sec = Math.floor(minutesms / 1000);

    let str = "";
    if (weeks) str = str + weeks + "w "
    if (days) str = str + days + "d ";
    if (hours) str = str + hours + "h ";
    if (minutes) str = str + minutes + "m ";
    if (!minutes) str = str + sec + "s ";

    return str;
}

module.exports = {
    name: 'stats',
    aliases: [ 'botstats', 'ping' ],
    description: {
        ru: 'Статистика бота',
        eng: 'Bot\'s statistics'
    },
    async execute(client, message) {
        const guild = client.cache.getGuild(message.guild.id);
        const promises = [
            await client.shard.fetchClientValues('guilds.cache.size'),
            await client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
            await client.shard.broadcastEval('this.ws.ping'),
            await client.shard.broadcastEval('process.memoryUsage().heapUsed / 1024**2'),
            await client.shard.broadcastEval('this.uptime'),
            await client.shard.broadcastEval('this.stats')
        ];
    let totalGuilds, totalMembers, pings, ram, uptimes, stats;
    let pingStr = '';
        await Promise.all(promises)
            .then(results => {
                totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
                pings = results[2];
                ram = results[3].reduce((acc, mb) => acc + mb, 0).toFixed(0)
                uptimes = results[4];
                stats = results[5];
            })
        for(let i = 0; i < 25; i++) {
            let ping = pings[i];
            let uptime = uptimes[i];
            if(!ping) break;

            if(ping > 200) {
                ping = `🔴 ${ping}ms\n`;
            } else if(200 > ping > 180) {
                ping = `🟡 ${ping}ms\n`;
            } else {
                ping = `🟢 ${ping}ms\n`;
            }
    pingStr += `**Shard ${i}**:\n Ping: ${ping} Uptime: ${uptimer(uptime)}\n`;
        }
        const cmds = stats.reduce((a, b) => a + b.commands, 0);
        const emb = new MessageEmbed()
            .setTitle(client.lang[guild.lang][this.name]['title'])
            .setDescription([
                `>>> **${client.lang[guild.lang][this.name]['guilds']}**: ${count(totalGuilds)}`,
                `**${client.lang[guild.lang][this.name]['users']}**: ${count(totalMembers)}`,
                `**${client.lang[guild.lang][this.name]['ram']}**: ${ram}MB`
            ])

            .setColor(cfg.colors.ok)
            .setThumbnail(client.user.displayAvatarURL({ size: 1024, animated: true }))

            .addField(client.lang[guild.lang][this.name]['shards'], '>>> ' + pingStr)
            .addField(client.lang[guild.lang][this.name]['links'][0],
                '>>> ' + client.lang[guild.lang][this.name]['links'][1]
                    .replace('%addLink%', `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
                    .replace('%serverLink%', 'https://quoter.ml/support'))
            .setFooter(client.lang[guild.lang][this.name]['footer'].replace('%commands%', cmds).replace('%events%', (client.stats.events / process.uptime()).toFixed(3)))
        void await message.channel.send(emb);
    }
}
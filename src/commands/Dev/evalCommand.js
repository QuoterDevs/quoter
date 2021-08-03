const { inspect } = require('util');
const { MessageEmbed } = require('discord.js');
const cfg = require('../../struct/cfg.json');

module.exports = {
    name: 'eval',
    args: true,
    aliases: [ 'e' ],
    usage: {
        ru: '<код>',
        eng: '<code>'
    },
    async execute(client, message, args) {
        let code = args.join(" ");
            if(code.includes('await')) {
                code = '(async() => (' + code + '))()';
            }
try {
    let preEval = process.hrtime.bigint();
    let evaled = await eval(code);
    let lastEval = process.hrtime.bigint();
  if (typeof evaled !== "string") evaled = inspect(evaled);
    message.reply(["Code completed in " + `${(parseInt(String(lastEval - preEval)) / 1000000).toFixed(3)}` + "ms\n" + evaled.slice(0, 1900)], { code: "js" });
} catch(e) {
    if (typeof(e) == "string") e = e.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    let evalerror = new MessageEmbed() 
        .setTitle("Произошла ошибка")
        .setDescription("```" + e + "```")
        .setColor(cfg.colors.error)
    message.reply(evalerror);
  
  }
    }
}
const { readdirSync } = require('fs');
const { MessageEmbed } = require('discord.js');
const cfg = require('../../Struct/cfg.json');

module.exports = {
    name: 'reload',
    aliases: [ 'r' ],
    args: true,
    usage: {
        ru: '<команда>',
        eng: '<command>'
    },
    async execute(client, message, args) {

        if(message.content.includes('--all')) {

            await message.react('😎')
            const commandDirs = readdirSync('./src/commands')
            for (const dir of commandDirs) {
                const commandFiles = readdirSync(`./src/commands/${dir}`).filter(file => file.endsWith('.js'));

                for (const file of commandFiles){

                    delete require.cache[require.resolve(`../${dir}/${file}`)];
                    const cmd = require(`../${dir}/${file}`)
                    cmd.dir = dir
                    cmd.filename = file
                    client.commands.set(cmd.name, cmd);

                }

            }
            return
        }
        if(message.content.includes('--events')) {

            await message.react('😎')
            message.client.removeAllListeners()

            readdirSync("./src/events")
                .filter(file => file.endsWith(".js"))
                .forEach(file => {

                    const event = require(`../../events/${file}`);
                    let eventName = file.split(".")[0];
                    client.on(eventName, event.bind(null, client));
                    delete require.cache[require.resolve(`../../events/${file}`)];

                    console.log(`Events | ✅ Loaded ${file} event`)
                });

            return
        }

        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.reply(`Не найдено команды под названием \`${commandName}\`, ${message.author}!`);
        try {


            const newCommand = require(`../../commands/${command.dir}/${command.file}`)
            delete require.cache[require.resolve(`../../commands/${command.dir}/${command.file}`)]
            newCommand.dir = command.dir
            newCommand.filename = command.filename
            message.client.commands.set(newCommand.name, newCommand)

            let emb = new MessageEmbed()
                .setDescription(`Команда \`${command.name}\` была перезагружена!`)
                .setColor(cfg.colors.dev)
            message.reply(emb);
            console.log(`Commands | ✅ Command ${command.name} has been reloaded!`)


        } catch (error) {
            console.error(error);
            message.reply(`Произошла ошибка во время перезагрузки команды \`${command.name}\`:\n\`${error.message}\``);
        }
    }
}
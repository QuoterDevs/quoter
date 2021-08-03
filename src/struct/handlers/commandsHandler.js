const { readdirSync } = require('fs');

module.exports = async(client) => {

    const CommandsDirs = readdirSync('./src/commands');
    if(!CommandsDirs.length) return console.log('CommandHandler | ❌ No command dirs were found');

    CommandsDirs
        .forEach(dir => {

            const CommandsFiles = readdirSync(`./src/commands/${dir}`);

            if(!CommandsFiles.length) {
                console.log(`CommandHandler | ${dir} | ❌ No commands were found`);
            } else {

                CommandsFiles
                    .forEach(cmdFile => {

                        const command = require(`../../commands/${dir}/${cmdFile}`);
                        command.dir = dir;
                        command.file = cmdFile;
                        client.commands.set(command.name, command);
                        console.log(`CommandHandler | ${dir} | ${command.name} | ✅ Loaded successfully`);

                    })
            }
        })
}
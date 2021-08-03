module.exports = async(client, message, command, errorEmbed) => {
    let guild = client.cache.getGuild(message.guild.id);
    let isModerator = false;
    if(guild.moderator) {
        const { roles } = guild.moderator;
        if(!roles.length) {
            isModerator = false;
        } else {
            for(const role of roles) {
                if(message.member.roles.cache.has(role)) {
                    isModerator = true;
                    break
                } else {
                    isModerator = false;
                }
            }
        }
    }


    if(command.permissions &&
        command.permissions.member &&
        !message.channel.permissionsFor(message.member).has(command.permissions.member) &&
        isModerator === false) {

        const perms = command.permissions.member.map(perm =>
            `\`${client.permissions[guild.lang][perm]}\``
        ).join(', ')

        errorEmbed
            .setDescription(client.lang[guild.lang]['global']['noPermsMember'].replace('%perms%', perms))
            .setThumbnail(message.author.displayAvatarURL({size: 1024, animated: true}))

        return {
            message: false,
            embed: errorEmbed
        }

    } else {
        return {
            message: true
        }
    }
}
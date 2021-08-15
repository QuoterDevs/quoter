let allowed = [
    '~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '_', '=', '+',
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
    'z', 'x', 'c', 'v', 'b', 'n', 'm',
    '[', '{', ']', '}', '(', ')', '!',
    '@', '#', '$', '%', '^', '&', '*',
    '.', ',', '?', '/', '|', '\\', '"', '\'', '<', '>',
    'й', 'ц', 'у', 'к', 'е', 'н',
    'г', 'ш', 'щ', 'з', 'ф', 'ы',
    'в', 'а', 'п', 'р', 'о', 'л',
    'д', 'з', 'х', 'ъ', 'ж', 'э',
    'я', 'ч', 'с', 'м', 'и', 'т',
    'ь', 'б', 'ю', 'і', 'ъ', 'ї', ' ', 'ё'
]

module.exports = async(client, eventName, member) => {
    if(member.bot) return;
    const guild = client.cache.getGuild(member.guild.id);
    if(!guild.corrector || !guild.corrector.enabled) return;

    let letters = member.displayName.split('');
    let name = '';
    for (const letter of letters) {
        if(allowed.includes(letter.toLowerCase())) {
            name += letter;
        }
    }
    if(name === member.displayName) return;
    try {
        if(!name.length) {
            await member.setNickname('name');
        } else {
            if(member.displayName !== name) await member.setNickname(name);
        }
    } catch {

    }
}
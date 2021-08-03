const cfg = require('../cfg.json');
const { Collection } = require('discord.js')

module.exports = {
  async cooldown(client, message, command) {
    const { guild } = message;
    const { cooldowns } = client;

    if(cfg.cooldowns[command.name]) {

      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.name);
      const cooldownAmount = (cfg.cooldowns[command.name] || 1) * 1000;

      if (timestamps.has(guild.id)) {
        const expirationTime = timestamps.get(guild.id) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;

          return {
            message : false,
            time : timeLeft.toFixed(1)
          }

        }
      }

      timestamps.set(guild.id, now);
      setTimeout(() => timestamps.delete(guild.id), cooldownAmount);

      return {
        message : true
      }

    } else {

      return {
        message : true
      }
    }

  }
}
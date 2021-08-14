module.exports = async (client, eventName, oldState, newState) => {
    if(!newState.guild.me.permissions.has('MANAGE_CHANNELS')) return
    if(!newState.guild.me.permissions.has('MOVE_MEMBERS')) return

    let req = client.cache.getGuild(newState.guild.id);

    if(!req.voice || !req.voice.enabled ) {
        return
    }
    let ChannelID = req.voice.channel
    let CategoryID = req.voice.category

  if(newState.channel?.id === ChannelID){

    newState.guild.channels.create(`${newState.member.user.username}`, { 
        type: "voice", 
        parent: CategoryID, 

        permissionOverwrites:
      [
        { 
        id: newState.member.id, 
        allow: ["MANAGE_CHANNELS"]
        },
        { 
          id: newState.guild.id, 
          deny: ["MANAGE_CHANNELS"] 
        }
      ] 
    })
        .then(channel=>{

      newState.setChannel(channel);  
      channel.setUserLimit(2);

      newState.guild.channels.cache.get(req.voice.channel).edit({
        permissionOverwrites: [{
            id: newState.guild.id, 
            deny: ["CONNECT"]
        }]  
      })

      setTimeout(() => 

      newState.guild.channels.cache.get(req.voice.channel).edit({
            permissionOverwrites: [{
                id: newState.guild.id, 
                allow: ["CONNECT"]
            }]  
      }), 5000)

    }) 
  } 
   if(oldState.channel?.id !== ChannelID &&
    oldState.channel?.parent?.id === CategoryID &&
    !oldState.channel?.members.size > 0) { 
        oldState.channel.delete();
   }
  }
const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");
const { attentionembed } = require("../util/attentionembed");

module.exports = {
  name: "nowpLaying",
  aliases: ["np"],
  description: "Show now playing song",
  cooldown: 5,
  execute(message, client) {
       if(!message.guild) return;
    //react with approve emoji
 message.delete({timeout: 300}) 
    const queue = message.client.queue.get(message.guild.id);
   if (!queue) return attentionembed(message, "There is nothing playing.").catch(console.error);

    const song = queue.songs[0];
    
     let minutes = song.duration.split(":")[0];
    let seconds = song.duration.split(":")[1];const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    let ms = (Number(minutes)*60+Number(seconds));
  
 
    //define left duration
    const left = ms - seek;


   let nowPlaying = new MessageEmbed()
      .setTitle("💫 Now playing")
      .setDescription(`[**${song.title}**](${song.url})`)
      .setThumbnail(song.thumbnail.url)
      .setColor("#ff0505")
      .setImage("https://cdn.discordapp.com/attachments/748630945640349756/776142404356276244/52-8ded5760a5e990dcb3ffbd7b73b5e74b090276dd.gif")
      .setFooter(`${message.author.username}#${message.author.discriminator}`, message.member.user.displayAvatarURL({ dynamic: true }))
      if(ms >= 10000) {
        nowPlaying.addField("\u200b", "🔴 LIVE", false);
        //send approve msg
        return message.channel.send(nowPlaying);
      }
      //If its not a stream
      if (ms > 0 && ms<10000) {
        nowPlaying.addField("\u200b", 
                            
                            "**__[" + createBar((ms == 0 ? seek : ms), seek, 25, "▬", "⚪")[0] + "]__**\n" +  new Date(seek * 1000).toISOString().substr(11, 8) +  " / "  + (ms == 0 ? " ◉ LIVE" : new Date(ms * 1000).toISOString().substr(11, 8)), false );
        //send approve msg
        return message.channel.send(nowPlaying);
      }
  }
};

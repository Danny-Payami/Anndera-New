////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const ytdl = require("discord-ytdl-core");
const { canModifyQueue } = require("../util/MilratoUtil");
const { Client, Collection, MessageEmbed, splitMessage, escapeMarkdown,MessageAttachment } = require("discord.js");
const { attentionembed } = require("../util/attentionembed");
const createBar = require("string-progressbar");
const lyricsFinder = require("lyrics-finder");
const {
  approveemoji,
  denyemoji,
  BOTNAME,
} = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  async play(song, message, client, filters) {
    //get the queue!
    const queue = message.client.queue.get(message.guild.id);
    //if no song provided
    if (!song) {
      //leave the channel
      queue.channel.leave();
      //delete the queue for this server
      message.client.queue.delete(message.guild.id);
      //define the embed
      const endembed = new MessageEmbed().setColor("#c219d8")
        .setAuthor(`Music Queue ended.`, "https://cdn.discordapp.com/emojis/769915194066862080.png")
      //set the embed
      return queue.textChannel.send(endembed).catch(console.error);
    }
    //do some variables defining
    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus"; //if its youtube change streamtype
    let isnotayoutube = false; //is not a youtube
    let seekTime = 0; //seektime to 0
    let oldSeekTime = queue.realseek; //the seek time if you skipped the song it would reset it himself, this provents it
    let encoderArgstoset; //encoderargs for the filters only for youtube tho
    if (filters)
    {
      //if filter is remove
      if (filters === "remove") {
        //clear the filters (actual setting them to something clean which stopps earraping)
        queue.filters = ['-af','dynaudnorm=f=200'];
        //defining encodersargs
        encoderArgstoset = queue.filters;
        //try to get seektime
        try{
          //set seektime to the howlong a song is playing plus the oldseektime
          seekTime = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000 + oldSeekTime;
        }
        //catch if try is not possible
        catch{
          //set seektime to 0
          seekTime = 0;
        }
        //set the realseek time with seektime
        queue.realseek = seekTime;
      }
      else{
        //try to get seektime
        try{
            //set seektime to the howlong a song is playing plus the oldseektime
          seekTime = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000 + oldSeekTime;
        }
        //catch if try is not possible
        catch{
          //set seektime to 0
          seekTime = 0;
        }
        //set the realseek time with seektime
        queue.realseek = seekTime;
        //push the queue filters array so that you can have multiple filters
        queue.filters.push(filters)
        //set the encoderargs to the filters
        encoderArgstoset = ['-af', queue.filters]
      }

    }


    try {
      if (song.url.includes("youtube.com")) {
         stream = ytdl(song.url, {
          filter: "audioonly",
          opusEncoded: true,
          encoderArgs: encoderArgstoset,
          bitrate: 320,
          seek: seekTime,
          quality: "highestaudio",
          liveBuffer: 40000,
          highWaterMark: 1 << 50, 

      });
      } else if (song.url.includes(".mp3") || song.url.includes("baseradiode")) {
        stream = song.url;
        isnotayoutube = true;
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return attentionembed(message, `Error: ${error.message ? error.message : error}`);
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    if(isnotayoutube){
      console.log("TEST")
      const dispatcher = queue.connection
      .play(stream)
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
    })
    .on("error", (err) => {
      console.error(err);
      queue.songs.shift();
      module.exports.play(queue.songs[0], message);
    });
  dispatcher.setVolumeLogarithmic(queue.volume / 100);
    }else{
      const dispatcher = queue.connection
      .play(stream, { type: streamType })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);
    }

   let thumb;
    if (song.thumbnail === undefined) thumb = "https://cdn.discordapp.com/attachments/748095614017077318/769672148524335114/unknown.png";
    else thumb = song.thumbnail.url;
    message.delete({timeout: 300}) 
    try {
          const newsong = new MessageEmbed()
        .setAuthor("Anndera", "")
        .setURL(song.url)      
        .setColor("#ff0505")
        .setThumbnail(thumb)
  
        .addField('Music Name :' , `[${song.title}](${song.url})`)
        .addField("Music Time :", `${song.duration} Minutes`, true)
        .addField("Voice Channel :", `${channel.name}` )
        .addField("Text Channel :", `${message.channel.name}` )
        .setFooter(`Requested by: ${message.author.username}#${message.author.discriminator}`, message.member.user.displayAvatarURL({ dynamic: true }))

      var playingMessage = await queue.textChannel.send(newsong);

      await playingMessage.react("⏯");
      await playingMessage.react("⏭");
      await playingMessage.react("🔇");
      await playingMessage.react("🔉");
      await playingMessage.react("🔊");
      await playingMessage.react("🔄");
      await playingMessage.react("🔘");
      await playingMessage.react("⏹");
    } catch (error) {
      console.error(error);
    }



    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", async (reaction, user) => {
      if (!queue) return;
     
      const member = message.guild.member(user);
      
     
      if (member.voice.channel !== member.guild.me.voice.channel) {

        member.send(new MessageEmbed()
        .setTitle("❌ | You must be in the Same Voice Channel as me!")
        .setColor("#ff0e7a"))
        
        reaction.users.remove(user).catch(console.error);
        
        console.log("not in the same ch."); 
        
        return; 
      }
      
      switch (reaction.emoji.name) {
        //queue
        case "⏯":
         reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
           const pausembed = new MessageEmbed().setColor("#ff0505")
              .setAuthor(`${user.username} Paused The Music.`, "")
            queue.textChannel.send(pausembed).catch(console.error);
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
          const resuembed = new MessageEmbed().setColor("#ff0505")
              .setAuthor(`${user.username} Resumed The Music!`, "")
          queue.textChannel.send(resuembed).catch(console.error);
          }
          break;
        //np
        case "🔘":
        reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
    const song = queue.songs[0];
    let minutes = song.duration.split(":")[0];
    let seconds = song.duration.split(":")[1];
           let thumb;
        if (song.thumbnail === undefined) thumb = "https://cdn.discordapp.com/attachments/748095614017077318/769672148524335114/unknown.png";
        else thumb = song.thumbnail.url;
    let ms = (Number(minutes)*60+Number(seconds));     
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;
    message.delete({timeout: 300})
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

        break;

        //skip
        case "⏭":
         queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
          const skipembed = new MessageEmbed().setColor("#ff0505").setAuthor(`${user.username} Skipped The Song.`, "")
          queue.textChannel.send(skipembed).catch(console.error);

          collector.stop();

          break;
        //lyrics
       case "🔇":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.volume <= 0) {
            queue.volume = 100;
            queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
            const unmtedembed = new MessageEmbed().setColor("#ff0505")
            .setAuthor(`${user.username} 🔊 Unmuted The music!`, "")
            queue.textChannel.send(unmtedembed).catch(console.error);
          } else {
            queue.volume = 0;
            queue.connection.dispatcher.setVolumeLogarithmic(0);
            const mutedembed = new MessageEmbed().setColor("#ff0505")
             .setAuthor(`${user.username}  Muted The Music!`, "")
            queue.textChannel.send(mutedembed).catch(console.error);
          }
          break;

        case "🔉":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member) || queue.volume == 0) return;
          if (queue.volume - 10 <= 0) queue.volume = 0;
          else queue.volume = queue.volume - 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          const decreasedembed = new MessageEmbed().setColor("#ff0505")
          .setAuthor(`${user.username} ⬇ Decreased The Volume ${queue.volume}%`, "")
          queue.textChannel.send(decreasedembed).catch(console.error);
          break;

        case "🔊":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member) || queue.volume == 100) return;
          if (queue.volume + 10 >= 100) queue.volume = 100;
          else queue.volume = queue.volume + 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          const increasedembed = new MessageEmbed().setColor("#ff0505")
          .setAuthor(`${user.username} ⬆ Increased The Volume${queue.volume}%`, "")
          queue.textChannel.send(increasedembed).catch(console.error);
          break;

        case "🔄":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
           const loopembed = new MessageEmbed().setColor("#ff0505")
            .setAuthor(`${user.username} 🔁 Loop is Now ${queue.loop ? " On" : " Off"}`, "")
          queue.textChannel.send(loopembed).catch(console.error);
          break;
          //stop
         case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
        const stopembed = new MessageEmbed().setColor("#ff0505")
        .setAuthor(`${user.username} ⏺ Stopped The Music!`, "")
          queue.textChannel.send(stopembed).catch(console.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }
};

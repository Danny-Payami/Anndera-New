const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");

module.exports = {
   name: "nowplaying",
  aliases: ["np"],
  description: "Show now playing song",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);

    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;

    let nowPlaying = new MessageEmbed()
      .setTitle("💫Now playing")
      .setDescription(`**${song.title}\n${song.url}**`)
      .setColor("#ff0505")
      .setImage("https://cdn.discordapp.com/attachments/748630945640349756/776142404356276244/52-8ded5760a5e990dcb3ffbd7b73b5e74b090276dd.gif")
      .setAuthor("Anndera Music", "https://cdn.discordapp.com/attachments/669950529090093105/776112872786231296/image0.png");
    if (song.duration > 0) {
      nowPlaying.addField(
        "\u200b",
        new Date(seek * 1000).toISOString().substr(11, 8) +
          "[" +
          createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
          "]" +
          (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
        false
      );
      nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));
    }

    return message.channel.send(nowPlaying);
  }
};

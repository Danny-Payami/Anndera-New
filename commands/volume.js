////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const { canModifyQueue } = require("../util/MilratoUtil");
const { Client, Collection, MessageEmbed } = require("discord.js");
const { attentionembed } = require("../util/attentionembed");
const { PREFIX } = require("../config.json");
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "volume",
  aliases: ["v"],
  description: "Change volume",
  cooldown: 5,
  edesc: `Type the Command, to change the volume of the current song.\nUsage: ${PREFIX}volume <0-200>`,

execute(message, args) {
    //if not a guild return
    if(!message.guild) return;
    //react with approve emoji
    message.react("✅");
  message.delete({timeout: 300}) 
    //get the current queue
    const queue = message.client.queue.get(message.guild.id);
    //if no queue return error
    if (!queue) return attentionembed(message,`There is nothing playing`);
    //if not in the same voice channel as the Bot return
    if (!canModifyQueue(message.member)) return;
    //define Info Embed
    const volinfoembed = new MessageEmbed()
    .setColor("#080000")
    .setTitle(`🔊 Volume is: \`${queue.volume}%\``)
    .setFooter(`${message.author.username}#${message.author.discriminator}`, message.member.user.displayAvatarURL({ dynamic: true }))
    message.delete({timeout: 300})
    //if no args return info embed
    if (!args[0]) return message.channel.send(volinfoembed).catch(console.error);
    //if args is not a number return error
    if (isNaN(args[0])) return attentionembed(message,  "Please use a number between **0 - 100**");
    //if args is not a Number between 150 and 0 return error
    if (parseInt(args[0]) < 0 || parseInt(args[0]) > 200)
    return attentionembed(message, "Please use a number between **0 - 100**");
    //set queue volume to args
    queue.volume = args[0];
    //set current volume to the wanted volume
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 150);
    //define approve embed
    const volinfosetembed = new MessageEmbed()
    .setColor("#ff0505")
    .setTitle("🔊 Volume has been **changed**  to (`" + args[0] +  "%`)")
    .setFooter(`${message.author.username}#${message.author.discriminator}`, message.member.user.displayAvatarURL({ dynamic: true }));
    //Send approve message
    return queue.textChannel.send(volinfosetembed).catch(console.error);
  }
};

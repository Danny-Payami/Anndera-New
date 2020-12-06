const { Client, Collection, MessageEmbed } = require("discord.js");
const {
  PREFIX,
  approveemoji,
  denyemoji
} = require(`../config.json`);

module.exports = {
  name: "about",
  description: "Show Bot info",
   aliases: ["abu"],
  cooldown: 15,
  execute(message, args, client) {
     message.delete({timeout: 300}) 
   const bot = new MessageEmbed()
      .setAuthor(`${message.author.username}`, message.member.user.displayAvatarURL({ dynamic: true }))
      .setColor("#ff0505")
      .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
      .addField("> Servers :  ", `> **${client.guilds.cache.size}**`, true)
      .addField("> Channels : ", `> **${client.channels.cache.size}**`, true)
      .addField("> Users : ", `> **${client.guilds.cache.reduce((a, g) => a + g.memberCount,0 )}**`, true)
      .addField("> Bot Name :  ", `> **${client.user.tag}**`, true)
      .addField("> Bot ID :  ", `> **${client.user.id}**`, true)
      .addField("> Invite :  ", `> [Add Anndera For Server You.](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=1140326208&scope=bot)`)
      .addField("> Support :  ", `> [Support Server Anndera](https://discord.gg/ecz5fX8nv8)`)
      .addField("> Bot Owner :  ", `> <@537241026839183371>`)
      .setImage("https://images-ext-2.discordapp.net/external/eSI8AEfgRqH0bP7U-pMdNNmyD91iEmr_sBpTRTVyTZo/https/media.discordapp.net/attachments/761322810144194560/765875969839726622/image3.gif?width=770&height=23")
      .setFooter(client.user.username, client.user.avatarURL())

   message.channel.send(bot);
  
 }
}

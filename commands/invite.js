const { Client, Collection, MessageEmbed } = require("discord.js");
const {
  PREFIX,
  approveemoji,
  denyemoji
} = require(`../config.json`);

module.exports = {
  name: "invite",
  description: "Gives you an invite",
  aliases: ["inv"],
  cooldown: 5,
  edesc: "Type this command to get an invite link for the Bot, thanks for every Invite",
  execute(message, args, client) {

 
   const inv = new MessageEmbed()
                  .setColor("#c219d8")
                  .setTitle("✨ | ClickHere To Add " + `${client.user.username}` + " For Server You.")
                  .setURL(
        "https://discord.com/api/oauth2/authorize?client_id=" +
          `${client.user.id}` +
          "&scope=bot&permissions=1140326208"
      )
                   .setTimestamp()
      .setFooter(`${message.author.username}#${message.author.discriminator}`, message.member.user.displayAvatarURL({ dynamic: true }))
      .setImage(
        "https://cdn.discordapp.com/attachments/770043620522328074/770306688266928158/image0.gif"
      )
      .setColor("#ff0505")
   message.channel.send(inv);
  
 }
}

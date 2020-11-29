const { Client, Collection, MessageEmbed } = require("discord.js");
const {
  PREFIX,
  approveemoji,
  denyemoji
} = require(`../config.json`);

module.exports = {
  name: "ping",
  description: "Gives you the ping of the Bot",
  cooldown: 3,
  edesc: "Type this command to see how fast the Bot can response to your messages / commands inputs!",
  execute(message, args, client) {
    //react with approve emoji
    var Bping = `${Math.round(client.ws.ping)}`;
    //send the Ping embed
     const E1ping = new MessageEmbed()
                  .setColor("#ff0505")
     .setTitle("`Anndera Music : PING`")
  
      .setDescription("ــــــــــــــــــــــــــــــ")
      .addField(
        `** Ping is** :__${Bping}📶__`,
        "ــــــــــــــــــــــــــــــ"
      )
      .setTimestamp()
      .setFooter(`${message.author.username}#${message.author.discriminator}`, message.member.user.displayAvatarURL({ dynamic: true }))
      .setImage("")
      .setColor("#ff0505")

    message.channel.send(E1ping);
  
 }
}

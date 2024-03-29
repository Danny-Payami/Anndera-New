const { Client, Collection } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const client = new Client({ disableMentions: "everyone" });

module.exports = {
  name: "help",
  aliases: ["h"],
  cooldown: 5,
  description: "Display all commands and descriptions",
  execute(message, client) {
    let commands = message.client.commands.array();

    let helpEmbed = new MessageEmbed()
      .setTitle("```List Of All Commands Anndera:```")
      .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.member.user.displayAvatarURL({ dynamic: true }))
      .setDescription("**[INVITE](https://discord.com/oauth2/authorize?client_id=768136969431416842&permissions=1140326208&scope=bot)** | **[SUPPORT](https://discord.gg/uTDmrGabaS)**")
      .setColor("#ff0505")
      .setImage(
        "https://cdn.discordapp.com/attachments/748630945640349756/776145752849645598/image0.gif"
      )
    .setFooter("Anndera", "https://cdn.discordapp.com/attachments/748630945640349756/785282450510184558/image0.png");

    commands.forEach((cmd) => {
      helpEmbed.addField(
        `**${message.client.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
        `${cmd.description}`,
        true
      );
    });

    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed).catch(console.error);
  }
};

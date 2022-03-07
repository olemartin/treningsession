// Require the necessary discord.js classes
const { MessageEmbed, Client, Intents } = require("discord.js");
const { memberNicknameMention, bold, italic } = require("@discordjs/builders");
require("dotenv").config();

var token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "register") {
    var description = interaction.options.getString("description");
    var password = interaction.options.getString("password");
    var duration = interaction.options.getInteger("duration");

    const response = new MessageEmbed()

      .setColor("#0099ff")
      .setTitle("Treningsession opprettet 🙌")
      .setAuthor({
        name: interaction.member.nickname,
        iconURL: interaction.user.displayAvatarURL({ format: "jpg" }),
      })
      .addFields(
        { name: "Beskrivelse", value: description },
        {
          name: "Lenke",
          value:
            "[Sessions](https://members.iracing.com/membersite/member/HostedSessions.do)",
          inline: true,
        },
        { name: "Passord", value: password, inline: true },
        { name: "Varighet", value: `${duration} minutter`, inline: true }
      );

    await interaction.reply({ value: "Hello", embeds: [response] });
  }
});

// Login to Discord with your client's token
client.login(token);

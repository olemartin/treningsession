// Require the necessary discord.js classes
const { MessageEmbed, Client, Intents } = require("discord.js");
const { createClient } = require("redis");
const dayjs = require("dayjs");

require("dotenv").config();

var token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const redis = createClient({
  url: process.env.REDISCLOUD_URL,
});

// When the client is ready, run this code (only once)
client.once("ready", async () => {
  await redis.connect();

  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const { commandName } = interaction;

  if (commandName === "status") {

    const optionMonth = interaction.options.getString("year-month");

    const month = optionMonth || dayjs().format("YYYY-MM");

    const data = await redis.hKeys(month);

    const response = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`Treningsessions for måned: ${month}`);

    const fields = await Promise.all(
      data.map(async (key) => {
        const minutes = await redis.hGet(month, key);
        return { name: key, value: minutes };
      })
    );
    response.fields = fields
      .sort((a, b) => b.value - a.value)
      .map((m) => ({ name: m.name, value: `${m.value} min.` }));

    await interaction.reply({ embeds: [response] });
  } else if (commandName === "register") {
    const month = dayjs().format("YYYY-MM");
    var description = interaction.options.getString("description");
    var password = interaction.options.getString("password");
    var duration = interaction.options.getInteger("duration");

    await redis.HINCRBY(
      month,
      interaction.member.nickname || interaction.member.user.username,
      duration
    );
    const response = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Treningsession opprettet 🙌")
      .setAuthor({
        name: interaction.member.nickname || interaction.member.user.username,
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

    await interaction.reply({ embeds: [response] });
  }
});

// Login to Discord with your client's token
client.login(token);

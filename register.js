const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

require("dotenv").config();

var token = process.env.DISCORD_TOKEN;
var clientId = process.env.CLIENT_ID;
var guildId = process.env.GUILD_ID;

const commands = [
  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Prints status for treningsessions")
    .addStringOption((option) =>
      option
        .setName("year-month")
        .setDescription("Month for the stats, ie 2022-01 for January 2022")
        .setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("register")
    .setDescription("Registers a trainingsession and outputs information")
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("The duration of the session in minutes")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Description of the training session")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("password")
        .setDescription("The password of the session")
        .setRequired(true)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

console.log(commands);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch((e) => console.error(e));

const Discord = require("discord.js");
const fetch = require("node-fetch");
require("dotenv").config();

const client = new Discord.Client();

const prefix = "!joke";

client.once("ready", () => {
  console.log(`[Logged in as ${client.user}]`);
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content == prefix) {
    fetch("https://v2.jokeapi.dev/joke/Any")
      .then((res) => res.json())
      .then((res) => {
        if (res.type == "twopart") {
          message.channel.send(res.setup);
          message.channel.send("||" + res.delivery + "||");
        } else if (res.type == "single") {
          message.channel.send(res.joke);
        }
      });
    return;
  }

  if (message.content == `${prefix} safe`) {
    fetch(
      "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit"
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.type == "twopart") {
          message.channel.send(res.setup);
          message.channel.send("||" + res.delivery + "||");
        } else if (res.type == "single") {
          message.channel.send(res.joke);
        }
      });
    return;
  }

  const joke_categories = [
    "Programming",
    "Miscellaneous",
    "Dark",
    "Pun",
    "Spooky",
    "Christmas",
  ];

  if (message.content.startsWith(prefix)) {
    let args = message.content
      .slice(prefix.length)
      .split(" ")
      .map((x) => toPascalCase(x))
      .filter((x) => joke_categories.indexOf(x) >= 0);
    args = [...new Set(args)];

    console.log(args);

    queryString = args.join(",");

    fetch("https://v2.jokeapi.dev/joke/" + queryString)
      .then((res) => res.json())
      .then((res) => {
        if (res.type == "twopart") {
          message.channel.send(res.setup);
          message.channel.send("||" + res.delivery + "||");
        } else if (res.type == "single") {
          message.channel.send(res.joke);
        }
      });
    return;
  }
});

const toPascalCase = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

client.login(process.env.TOKEN);

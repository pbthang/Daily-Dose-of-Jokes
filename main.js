const Discord = require("discord.js");
const fetch = require("node-fetch");
require("dotenv").config();

const client = new Discord.Client();

const prefix = "!joke";

client.once("ready", () => {
  client.user.setActivity("!joke help", { type: "PLAYING" });
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
          message.channel
            .send("||" + res.delivery + "||")
            .then((msg) => msg.react("🤡"));
        } else if (res.type == "single") {
          message.channel.send(res.joke).then((msg) => msg.react("🤡"));
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
          message.channel
            .send("||" + res.delivery + "||")
            .then((msg) => msg.react("🤡"));
        } else if (res.type == "single") {
          message.channel.send(res.joke).then((msg) => msg.react("🤡"));
        }
      });
    return;
  }

  if (message.content == `${prefix} help`) {
    message.channel.send(
      `
    **Daily-Dose-of-Jokes**
    A discord bot that tells jokes
    Link: [https://discord.com/api/oauth2/authorize?client_id=848780842683465758&permissions=2148001856&scope=bot]
    
    **Basic command**:
    - \`!joke\` tell any jokes (including nsfw)
    - \`!joke [list of categories]\` jokes from a set of categories
      \t- List of categories available: Programming, Miscellaneous, Dark, Pun, Spooky, Christmas
      \t- E.g: \`!joke dark pun\`
    - \`!joke safe\` jokes that are safe-for-work and family-friendly
    
    API used: [https://sv443.net/jokeapi/v2/]`
    );
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
    if (args.length === 0) return;

    queryString = args.join(",");

    fetch("https://v2.jokeapi.dev/joke/" + queryString)
      .then((res) => res.json())
      .then((res) => {
        if (res.type == "twopart") {
          message.channel.send(res.setup);
          message.channel
            .send("||" + res.delivery + "||")
            .then((msg) => msg.react("🤡"));
        } else if (res.type == "single") {
          message.channel.send(res.joke).then((msg) => msg.react("🤡"));
        }
      });
    return;
  }
});

const toPascalCase = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

client.login(process.env.TOKEN);

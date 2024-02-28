"use strict";

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

const token =
  "MTIxMTE1NDEzODk1MjYzNDM4OA.GF74xg.bvB7s8jiI-O4JWdQlShbsWq9Pux1OD4AKknDXI";
client.login(token);

client.on("messageCreate", (msg) => {
  // Loại trừ trường hợp message tạo ra bởi bot, nếu không sẽ xuất hiện tình trạng đệ quy
  // (Tức là bot trả lời liên tục)
  if (msg.author.bot) return;
  if (msg.content === "hello") {
    msg.reply(`Hello! How can I assist you today?`);
  }
});

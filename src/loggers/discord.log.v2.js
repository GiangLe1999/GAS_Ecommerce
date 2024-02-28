"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const { DISCORD_CHANNEL_ID, DISCORD_TOKEN } = process.env;

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    // Add ChannelID (ServerID)
    this.channelId = DISCORD_CHANNEL_ID;

    // Log sau khi đăng nhập Client thành công
    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}`);
    });

    // Đăng nhập channel
    this.client.login(DISCORD_TOKEN);
  }

  sendFormatCode(logData) {
    const {
      code,
      message = "This is some additional information about the code",
      title = "Code Example",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          // Convert hexadecimal color code to integer
          color: parseInt("00ff00", 16),
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };

    this.sendMessage(codeMessage);
  }

  // Method dùng để gửi message vào channel
  sendMessage(message = "message") {
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) {
      console.error(`Could not find channel with ID: ${this.channelId}`);
    }

    channel.send(message).catch((e) => console.log(e));
  }
}

const loggerService = new LoggerService();

module.exports = loggerService;

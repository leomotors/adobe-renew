import { Client, GatewayIntentBits } from "discord.js";

import { env } from "./env";

async function createDiscordClient() {
  const client = new Client({ intents: [GatewayIntentBits.GuildMessages] });
  const promise = new Promise<Client<true>>((resolve) => {
    client.once("ready", async (cli) => {
      await cli.channels.fetch(env.CHANNEL_ID);
      resolve(cli);
    });
  });

  client.login(env.DISCORD_TOKEN);

  return await promise;
}

const clientPromise = createDiscordClient();

async function getChannel() {
  const client = await clientPromise;

  const channel = client.channels.cache.get(env.CHANNEL_ID);

  if (!channel) {
    throw new Error("Channel not found");
  }

  if (!channel.isTextBased()) {
    throw new Error("Channel is not text based");
  }

  return channel;
}

// fuck chatgpt
export async function sendImage(content: string, imagePath: string) {
  const channel = await getChannel();

  await channel.send({ content, files: [imagePath] });
}

export async function sendMessage(content: string) {
  const channel = await getChannel();

  await channel.send({ content });
}

process.on("SIGTERM", async () => {
  (await clientPromise).destroy();
});

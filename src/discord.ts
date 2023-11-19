import { Routes } from "discord-api-types/v10";

import { env } from "./env";

const endpoint = "https://discord.com/api/v10";

export async function sendMessage(content: string) {
  console.log("Sending image to discord...");

  const res = await fetch(endpoint + Routes.channelMessages(env.CHANNEL_ID), {
    method: "POST",
    headers: {
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    console.error(`Discord API Failed ${res.status} ${res.statusText}`);
    // not gonna print res.text() on production since the log is public
    if (process.env.DEV === "frfr") {
      console.error(await res.text());
    }
  }
}

export async function sendImage(
  content: string,
  fileName: string,
  buffer: Buffer,
) {
  console.log(`Sending image with size of ${buffer.length} to Discord...`);

  const formData = new FormData();
  formData.append("content", content);
  formData.append("files", new Blob([buffer]), fileName);

  const res = await fetch(endpoint + Routes.channelMessages(env.CHANNEL_ID), {
    method: "POST",
    headers: {
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
    },
    body: formData,
  });

  if (!res.ok) {
    console.error(`Discord API Failed ${res.status} ${res.statusText}`);
    // not gonna print res.text() on production since the log is public
    if (process.env.DEV === "frfr") {
      console.error(await res.text());
    }
  }
}

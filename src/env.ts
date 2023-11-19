import { z } from "zod";

const envSchema = z.object({
  USERNAME: z.string(),
  PASSWORD: z.string(),
  DISCORD_TOKEN: z.string().min(10),
  CHANNEL_ID: z.string().min(10),
});

export const env = envSchema.parse({
  USERNAME: process.env.USERNAME,
  PASSWORD: process.env.PASSWORD,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  CHANNEL_ID: process.env.CHANNEL_ID,
});

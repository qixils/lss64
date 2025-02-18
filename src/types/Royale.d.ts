import { z } from "zod";

export const LobbyRoyaleUserSchema = z.object({
  score: z.number(),
  ccUID: z.string(),
  name: z.string(),
  image: z.string(),
  joinedAt: z.string(),
  profile: z.enum(['twitch', 'youtube']),
  originID: z.string(),
  channel: z.string(),
})

export type LobbyRoyaleUser = z.output<typeof LobbyRoyaleUserSchema>

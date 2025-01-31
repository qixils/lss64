import z from "zod"
import { LobbyRoyaleUserSchema } from "../types"
import { royalePlayers } from "./util/replicants"
import { get } from "./util/nodecg";

const nodecg = get()
const baseUrl = new URL('https://openapi.crowdcontrol.live')

const updatePlayers = async () => {
  const result = z.array(LobbyRoyaleUserSchema).safeParse(await fetch(new URL("/royale/game", baseUrl)).then(r => r.json()))
  if (!result.success) return

  royalePlayers.value = result.data
}

nodecg.listenFor('updatePlayers', updatePlayers)

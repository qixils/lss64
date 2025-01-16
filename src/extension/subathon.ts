// Require the necessary discord.js classes
import fs = require('node:fs');
import path = require('node:path');
import { get } from "./util/nodecg";
import { bundleConfig } from "./util/helpers";
import { Client, Collection, Events, GatewayIntentBits, Routes, User, VoiceChannel } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";
import { channelVoiceStatus, subathonState } from "./util/replicants";
import { SlashCommandBuilder } from 'discord.js';
import { Supporter } from '../types';
import { randomUUID } from 'node:crypto';

const nodecg = get();
const config = bundleConfig();

// TODO: if
subathonState.value = {
  goal: "09:59:59",
  percentile: 99.9,
  supporters: [],
}

let supporterIndex = subathonState.value.supporters[0]?.index ?? 0

const goals: number[] = []

const updateGoal = () => {
  if (goals.length < 1000) return
}

const pushSupporter = (supporter: Supporter) => {
  // TODO: update goal
  const supporters = [supporter, ...subathonState.value.supporters]
  while (supporters.length > 15) {
    supporters.pop()
  }
  subathonState.value = { ...subathonState.value, supporters }
  console.log("Pushed", supporter, "to", supporters)
}

setInterval(() => {
  pushSupporter({
    action: "sub",
    amount: 1,
    index: ++supporterIndex,
    user: "lexikiq",
  })
}, 2000)

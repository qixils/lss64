"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const wait = require('node:timers/promises').setTimeout;
const postOn = [10, 7, 5, 4, 3, 2, 1, 0];
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('countdown')
        .setDescription('Starts a 10 second countdown'),
    async execute(interaction) {
        await interaction.reply('10...');
        for (let i = 9; i >= 0; i--) {
            await wait(1000);
            if (!postOn.includes(i))
                continue;
            await interaction.editReply(i === 0 ? '**GO!**' : `${i}...`);
        }
    },
};

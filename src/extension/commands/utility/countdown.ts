import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
const wait = require('node:timers/promises').setTimeout;

const postOn = [10, 7, 5, 4, 3, 2, 1, 0]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('countdown')
		.setDescription('Starts a 10 second countdown'),

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply('10...');
		for (let i = 9; i >= 0; i--) {
			await wait(1_000)
			if (!postOn.includes(i)) continue
			await interaction.editReply(i === 0 ? '**GO!**' : `${i}...`)
		}
	},
};

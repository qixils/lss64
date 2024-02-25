// Require the necessary discord.js classes
import { get } from "./util/nodecg";
import { bundleConfig } from "./util/helpers";
import { Client, Events, GatewayIntentBits, User, VoiceChannel } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";
import { channelVoiceStatus } from "./util/replicants";

const nodecg = get();
const config = bundleConfig();

if (config?.discord?.token) {
	// Create a new client instance
	const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds] });

	// When the client is ready, run this code (only once).
	// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
	// It makes some properties non-nullable.
	client.once(Events.ClientReady, async (readyClient) => {
		nodecg.log.info(`[Discord] Integration ready as ${readyClient.user.tag}`);

		// prepare variables
		channelVoiceStatus.value = { users: {} }
		async function getUser(userId: string): Promise<User> { return await client.users.fetch(userId) }
		async function setStatus(userId: string, speaking: boolean) {
			const userState = guild.voiceStates.cache.get(userId)
			const user = await getUser(userId)
			channelVoiceStatus.value.users[user.username] = {
				speaking,
				mute: userState?.mute ?? false,
				deaf: userState?.deaf ?? false,
				pfp: user.displayAvatarURL({ size: 256 })
			}
		}

		const guild = await client.guilds.fetch(config.discord.guild)

		// init voice channel status
		// technically this is a bit wasteful since i throw away the value but it's once on startup so whatever
		guild.voiceStates.cache.forEach(async (value, userId) => await setStatus(userId, false) )

		// join voice channel
		const channel = await client.channels.fetch(config.discord.channel) as VoiceChannel
		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
			selfDeaf: false,
			selfMute: true,
		})
		const receiver = connection.receiver
		const speaking = receiver.speaking

		// set listeners
		speaking.on('start', async (userId) => { await setStatus(userId, true) })
		speaking.on('end', async (userId) => { await setStatus(userId, false) })
		client.on('voiceStateUpdate', async (oldState, newState) => {
			if (oldState.channelId !== newState.channelId) {
				await setStatus(newState.member.id, false)
			}
		})
	})

	// Log in to Discord with your client's token
	client.login(config.discord.token);
}

// Require the necessary discord.js classes
import { get } from "./util/nodecg";
import { bundleConfig } from "./util/helpers";
import { Client, Events, GatewayIntentBits, VoiceChannel } from "discord.js";
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

		const guild = await client.guilds.fetch(config.discord.guild)
		const channel = await client.channels.fetch(config.discord.channel) as VoiceChannel
		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
			selfDeaf: false,
			selfMute: true,
		});
		const receiver = connection.receiver
		const speaking = receiver.speaking

		const usernames = {}
		async function username(userId: string): Promise<string> {
			if (userId !in usernames) {
				usernames[userId] = (await client.users.fetch(userId)).username;
			}
			return usernames[userId]
		}

		channelVoiceStatus.value = { users: {} }
		speaking.on('start', async (userId) => { channelVoiceStatus.value.users[await username(userId)] = { talking: true } })
		speaking.on('end', async (userId) => { channelVoiceStatus.value.users[await username(userId)] = { talking: false } })
	});

	// Log in to Discord with your client's token
	client.login(config.discord.token);
}

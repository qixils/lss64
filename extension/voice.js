"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Require the necessary discord.js classes
const nodecg_1 = require("./util/nodecg");
const helpers_1 = require("./util/helpers");
const discord_js_1 = require("discord.js");
const voice_1 = require("@discordjs/voice");
const replicants_1 = require("./util/replicants");
const nodecg = (0, nodecg_1.get)();
const config = (0, helpers_1.bundleConfig)();
if (config?.discord?.token) {
    // Create a new client instance
    const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildVoiceStates, discord_js_1.GatewayIntentBits.GuildMembers, discord_js_1.GatewayIntentBits.Guilds] });
    // When the client is ready, run this code (only once).
    // The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
    // It makes some properties non-nullable.
    client.once(discord_js_1.Events.ClientReady, async (readyClient) => {
        nodecg.log.info(`[Discord] Integration ready as ${readyClient.user.tag}`);
        const guild = await client.guilds.fetch(config.discord.guild);
        const channel = await client.channels.fetch(config.discord.channel);
        const connection = (0, voice_1.joinVoiceChannel)({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: true,
        });
        const receiver = connection.receiver;
        const speaking = receiver.speaking;
        const usernames = {};
        async function username(userId) {
            if (userId in usernames) {
                usernames[userId] = (await client.users.fetch(userId)).username;
            }
            return usernames[userId];
        }
        replicants_1.channelVoiceStatus.value = { users: {} };
        speaking.on('start', async (userId) => { replicants_1.channelVoiceStatus.value.users[await username(userId)] = { talking: true }; nodecg.log.info("talking"); });
        speaking.on('end', async (userId) => { replicants_1.channelVoiceStatus.value.users[await username(userId)] = { talking: false }; nodecg.log.info("not talking"); });
    });
    // Log in to Discord with your client's token
    client.login(config.discord.token);
}

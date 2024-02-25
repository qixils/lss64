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
        // prepare variables
        replicants_1.channelVoiceStatus.value = { users: {} };
        async function getUser(userId) { return await client.users.fetch(userId); }
        async function setStatus(userId, speaking) {
            const userState = guild.voiceStates.cache.get(userId);
            const user = await getUser(userId);
            replicants_1.channelVoiceStatus.value.users[user.username] = {
                speaking,
                mute: userState?.mute ?? false,
                deaf: userState?.deaf ?? false,
                pfp: user.displayAvatarURL({ size: 256 })
            };
        }
        const guild = await client.guilds.fetch(config.discord.guild);
        // init voice channel status
        // technically this is a bit wasteful since i throw away the value but it's once on startup so whatever
        guild.voiceStates.cache.forEach(async (value, userId) => await setStatus(userId, false));
        // join voice channel
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
        // set listeners
        speaking.on('start', async (userId) => { await setStatus(userId, true); });
        speaking.on('end', async (userId) => { await setStatus(userId, false); });
        client.on('voiceStateUpdate', async (oldState, newState) => {
            if (oldState.channelId !== newState.channelId) {
                await setStatus(newState.member.id, false);
            }
        });
    });
    // Log in to Discord with your client's token
    client.login(config.discord.token);
}

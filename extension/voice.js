"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Require the necessary discord.js classes
const fs = require("node:fs");
const path = require("node:path");
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
    // commands
    client.commands = new discord_js_1.Collection();
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);
    nodecg.log.info(`[Discord] Registering commands from`, foldersPath);
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        nodecg.log.info(`[Discord] Registering commands from subfolder`, commandsPath);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            nodecg.log.info(`[Discord] Registering command from file`, filePath);
            const command = require(filePath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                nodecg.log.info(`[Discord] Registering command ${command.data.name}`);
                client.commands.set(command.data.name, command);
            }
            else {
                nodecg.log.warn(`[Discord] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
    client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand())
            return;
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            }
            else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });
    // When the client is ready, run this code (only once).
    // The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
    // It makes some properties non-nullable.
    client.once(discord_js_1.Events.ClientReady, async (readyClient) => {
        nodecg.log.info(`[Discord] Integration ready as ${readyClient.user.tag}`);
        try {
            if (client.commands.size > 0) {
                nodecg.log.info(`[Discord] Registering commands`);
                const data = await readyClient.rest.put(discord_js_1.Routes.applicationGuildCommands(readyClient.application.id, config.discord.guild), { body: client.commands.mapValues(command => command.data.toJSON()) });
                nodecg.log.info(`[Discord] Register result:`, data);
            }
            else {
                nodecg.log.warn(`[Discord] No commands to register`);
            }
        }
        catch (e) {
            nodecg.log.error(`[Discord] Failed to install commands`, e);
        }
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
            if (newState.member?.id && oldState.channelId !== newState.channelId) {
                await setStatus(newState.member.id, false);
            }
        });
    });
    // Log in to Discord with your client's token
    client.login(config.discord.token).catch(() => { });
}

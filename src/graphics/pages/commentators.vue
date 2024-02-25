<script setup lang="ts">
import { computed } from 'vue';
import type { RunDataCommentator } from 'nodecg-speedcontrol/src/types';
import PlayerName from '../components/PlayerName.vue';
import { useRun } from '../composables/run';
import { useVoice } from '../composables/voice';
import { UserVoiceStatus } from '../../types';

const { activeRun } = useRun()
const { channelVoiceStatus } = useVoice()

const commentators = computed<RunDataCommentator[]>(() => activeRun.value?.commentators ?? activeRun.value?.teams?.find(team => team.name === "Commentators")?.players ?? [])

function getVoiceStatus(commentator: RunDataCommentator): UserVoiceStatus | undefined {
	const discord = commentator.customData.discord
	if (!discord) return;
	return channelVoiceStatus.value.users[discord]
}
</script>

<template>
	<div class="commentator-container">
		<div class="commentator" v-for="commentator in commentators">
			<img
			:src="getVoiceStatus(commentator)?.pfp ?? 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/1f399.png'"
			:class="{ active: getVoiceStatus(commentator)?.speaking, pfp: getVoiceStatus(commentator)?.pfp }"
			>
			<PlayerName :scale="0.85" :player="commentator" />
		</div>
	</div>
</template>

<style>
html, body, #__nuxt, .root, .commentator-container {
	width: 100vw;
	height: 100vh;
}

.commentator-container {
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	margin-left: 0.5rem;
}

.commentator {
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: center;
	height: 3.5rem; /* hack fix */
}

p {
	font-size: 3rem;
	padding: 0;
	margin: 0;
	color: white;
	text-shadow: 0 0 4px black;
}
</style>

<style scoped>
img, svg {
	aspect-ratio: 1 / 1;
	width: 2.5rem;
	padding: 0.1rem;
	border: 0.25rem solid transparent;
}

.active {
	border-color: #23a559;
}

.pfp {
	border-radius: 100%;
}
</style>

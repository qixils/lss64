<script setup lang="ts">
import type { RunDataPlayer } from 'nodecg-speedcontrol/src/types';
import PlayerName from '../components/PlayerName.vue';
import { useRun } from '../composables/run';

const { activeRun } = useRun()

const commentators = computed<RunDataPlayer[]>(() => activeRun.value?.teams?.find(team => team.name === "Commentators")?.players ?? [])
</script>

<template>
	<div class="commentator-container">
		<div class="commentator" v-for="commentator in commentators">
			<img src="https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/1f399.png">
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
img {
	aspect-ratio: 1 / 1;
	width: 2.35rem;
}
</style>

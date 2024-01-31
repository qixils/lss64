<script setup lang="ts">
import type { RunDataPlayer } from 'nodecg-speedcontrol/src/types';
import { useRun } from '../composables/run';

const { activeRun } = useRun()

const commentators = computed<RunDataPlayer[]>(() => activeRun.value?.teams?.find(team => team.name === "Commentators")?.players ?? [])
</script>

<template>
	<div class="commentator-container">
		<p v-for="commentator in commentators">
			<img src="https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/1f399.png">
			{{ commentator.name }}
			<span v-if="commentator.pronouns">
				({{ commentator.pronouns }})
			</span>
		</p>
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
</style>

<style scoped>
img {
	aspect-ratio: 1 / 1;
	width: 2.35rem;
}

p {
	font-size: 3rem;
	padding: 0;
	margin: 0;
	color: white;
	text-shadow: 0 0 4px black;
}
</style>

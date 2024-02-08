<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Pronouns from './Pronouns.vue';
import type { RunDataPlayer } from '../../nodecg-speedcontrol/src/types';

const props = defineProps<{
	scale: number,
	player?: RunDataPlayer,
	alignment?: "left" | "right",
}>()

const showingTwitch = ref<boolean>(false)
let interval: any

onMounted(() => {
	interval = setInterval(() => {
		showingTwitch.value = !showingTwitch.value
	}, 10000)
})

onUnmounted(() => {
	if (interval) clearInterval(interval)
})
</script>

<template>
	<Transition>
		<div v-if="showingTwitch && player?.social?.twitch" :class="{ right: alignment === 'right' }">
			<p>/{{ player?.social?.twitch }}</p>
			<Pronouns :pronouns="player?.pronouns" :scale="scale" />
		</div>
		<div v-else :class="{ right: alignment === 'right' }">
			<p>{{ player?.name ?? 'Runner' }}</p>
			<Pronouns :pronouns="player?.pronouns" :scale="scale" />
		</div>
	</Transition>
</template>

<style scoped>
div {
	margin: 0;
	padding: 0 calc(1rem * v-bind(scale));
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	gap: calc(1rem * v-bind(scale));
	align-items: center;
	height: 100%;
}

.right {
	justify-content: flex-end;
}

p {
	display: inline-block;
	width: fit-content;
	margin: 0;
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

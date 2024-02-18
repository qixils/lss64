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
const shouldShowTwitch = computed<boolean>(() => showingTwitch.value && !!props.player?.social?.twitch)
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
	<div class="player-root">
		<Transition>
			<div v-if="!shouldShowTwitch" class="normal wrapper" :class="{ right: alignment === 'right' }">
				<p>{{ player?.name ?? 'Runner' }}</p>
				<Pronouns :pronouns="player?.pronouns" :scale="scale" />
			</div>
			<div v-else class="twitch wrapper" :class="{ right: alignment === 'right' }">
				<p>/{{ player?.social?.twitch }}</p>
				<Pronouns :pronouns="player?.pronouns" :scale="scale" />
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.player-root {
	position: relative;
	height: 100%;
	min-height: fit-content;
	width: 100%;
	min-width: fit-content;
}

.wrapper {
	margin: 0;
	padding: 0 calc(1rem * v-bind(scale));
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	gap: calc(1rem * v-bind(scale));
	align-items: center;
	height: 100%;
	min-height: fit-content;
	position: absolute;
}

.right {
	justify-content: flex-end;
}

p {
	display: inline-block;
	width: fit-content;
	margin: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

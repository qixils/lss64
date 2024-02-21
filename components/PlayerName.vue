<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Pronouns from './Pronouns.vue';
import type { RunDataCommentator } from '../../nodecg-speedcontrol/src/types';

const props = defineProps<{
	scale: number,
	player?: RunDataCommentator,
	alignment?: "left" | "right",
}>()

const stage = ref<number>(0)
const shouldShowTwitch = computed<boolean>(() => stage.value % 2 == 1 && !!props.player?.social?.twitch)
let timeout: any

function schedule() {
	let now = Date.now()
	stage.value = Math.round(now / 10000) // 10 seconds
	let millis = now % 1000
	let delay = 1000 - millis
	timeout = setTimeout(schedule, delay)
}

onMounted(() => {
	schedule()
})

onUnmounted(() => {
	if (timeout) {
		clearTimeout(timeout)
		timeout = undefined
	}
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
}

.wrapper {
	margin: 0;
	padding: 0 calc(1rem * v-bind(scale));
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	gap: calc(1rem * v-bind(scale));
	align-items: center;
	position: absolute;
}

.player-root, .wrapper {
	height: 100%;
	min-height: fit-content;
	width: 100%;
	min-width: fit-content;
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
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

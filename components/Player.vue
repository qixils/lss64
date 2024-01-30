<script setup lang="ts">
import { computed } from 'vue';
import { useRun } from '../composables/run';
import type { RunDataPlayer } from '../../nodecg-speedcontrol/src/types';

const props = defineProps<{
	scale: number,
	player: number,
	alignment?: "left" | "right",
}>()

const { activeRun } = useRun()

const runner = computed<RunDataPlayer | undefined>(() => activeRun.value?.teams?.[props.player]?.players?.[0])
const seed = computed<Number>(() => parseInt(runner.value?.country ?? "16"))
</script>

<template>
	<p v-if="alignment !== 'right'" class="seed">{{ seed }}</p>
	<p class="player" :class="{ right: alignment === 'right' }">
		{{ runner?.name ?? 'Player' }}
		<span v-if="runner?.pronouns">
			({{ runner.pronouns }})
		</span>
	</p>
	<p v-if="alignment === 'right'" class="seed">{{ seed }}</p>
</template>

<style scoped>
.seed {
	background-color: #1c1c1ccc;
	text-align: center;
	width: calc(5.5rem * v-bind(scale));
	margin: 0;
	padding: 0;
}

.player {
	background-color: #565656cc;
	margin: 0;
	padding: 0 calc(1rem * v-bind(scale));
}

.right {
	text-align: end;
}
</style>

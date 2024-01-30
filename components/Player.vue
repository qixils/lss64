<script setup lang="ts">
import { computed } from 'vue';
import { useRun } from '../composables/run';
import type { RunDataPlayer } from '../../nodecg-speedcontrol/src/types';

const props = defineProps<{
	player: number,
	alignment?: "left" | "right",
}>()

const { activeRun } = useRun()

const runner = computed<RunDataPlayer | undefined>(() => activeRun.value?.teams?.[props.player]?.players?.[0])
</script>

<template>
	<div class="wrapper">
		<p class="seed">16</p> <!-- TODO -->
		<p class="player" :class="{ right: alignment === 'right' }">
			{{ runner?.name ?? 'Player' }}
			<span v-if="runner?.pronouns">
				({{ runner.pronouns }})
			</span>
		</p>
	</div>
</template>

<style scoped>
.seed {
	background-color: rgba(50, 50, 50, 0.8);
	text-align: center;
	vertical-align: middle;
	width: 1.5em;
	font-size: 2em;
	height: 100%;
}

.player {
	background-color: rgba(150, 150, 150, 0.8);
	flex-grow: 1;
	font-size: 2em;
	height: 100%;
}

.right {
	text-align: right;
}

.wrapper {
	display: flex;
	flex-flow: row nowrap;
}
</style>

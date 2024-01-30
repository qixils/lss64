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
	<div class="wrapper" :class="{ reverse: alignment === 'right' }">
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
	background-color: #1c1c1ccc;
	text-align: center;
	width: 1.4rem;
	font-size: 1.85rem;
	margin: 0;
	padding: 0;
}

.player {
	background-color: #565656cc;
	flex-grow: 1;
	font-size: 1.85rem;
	margin: 0;
	padding: 0 0.2rem;
}

.right {
	text-align: end;
}

.wrapper {
	display: flex;
	flex-flow: row nowrap;
	height: 100%;
	margin: 0;
	padding: 0;
}

.reverse {
	flex-flow: row-reverse nowrap !important;
}
</style>

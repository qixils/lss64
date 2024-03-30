<script setup lang="ts">
import { computed } from 'vue';
import { useRun } from '../composables/run';
import PlayerName from './PlayerName.vue';
import type { RunDataPlayer } from '../../../../nodecg-speedcontrol/src/types';

const props = defineProps<{
	scale: number,
	player: number,
	alignment?: "left" | "right",
}>()

const { activeRun } = useRun()

const runner = computed(() => activeRun.value?.teams?.[props.player]?.players?.[0])
const seed = computed(() => runner.value?.customData?.seed)
</script>

<template>
	<template v-if="alignment !== 'right'">
		<p v-if="seed" class="seed">{{ seed }}</p>
		<div v-else></div>
	</template>
	<div class="runner">
		<PlayerName :scale="scale" :player="runner" :alignment="alignment" />
	</div>
	<template v-if="alignment === 'right'">
		<p v-if="seed" class="seed">{{ seed }}</p>
		<div v-else></div>
	</template>
</template>

<style scoped>
.seed {
	background-color: hsla(276, 20%, 10%, 0.8);
	text-align: center;
	width: calc(5.5rem * v-bind(scale));
	margin: 0;
	padding: 0;
}

.runner {
	background-color: hsla(276, 20%, 35%, 0.8);
}
</style>

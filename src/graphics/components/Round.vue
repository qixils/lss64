<script setup lang="ts">
import { computed } from 'vue';
import { useRun } from '../composables/run';

const props = defineProps<{
	scale: number,
	bgColor?: string,
}>()

const bgColorDef = computed<String>(() => props.bgColor ?? "#463e4ccc" )

const { activeRun } = useRun()
</script>

<template>
	<div>
		<p v-if="activeRun?.game">{{ activeRun.game }}</p>
		<p v-if="activeRun?.category">{{ activeRun.category }}</p>
	</div>
</template>

<style scoped>
div {
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	gap: .25rem 1rem;
	margin: 0;
	padding: 0;
	background-color: v-bind(bgColorDef);
	font-size: calc(3rem * v-bind(scale));
}

p {
	display: inline-block;
	margin: 0;
	padding: 0;
}

p:first-child {
	font-weight: 700
}
</style>

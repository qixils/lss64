<script setup lang="ts">
import { useRun } from '../composables/run';

const props = defineProps<{
	scale: number,
	bgColor?: string,
}>()

const bgColorDef = computed<String>(() => props.bgColor ?? "#454545cc" )

const { activeRun } = useRun()
</script>

<template>
	<p class="round">{{ activeRun?.category || "Unknown Round" }}</p>
</template>

<style scoped>
.round {
	text-align: center;
	margin: 0;
	padding: 0;
	background-color: v-bind(bgColorDef);
	font-weight: 700;
	font-size: calc(3rem * v-bind(scale));
}
</style>

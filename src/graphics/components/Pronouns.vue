<script setup lang="ts">
const props = defineProps<{
	scale: number,
	pronouns: string | undefined,
}>()
</script>

<template>
	<p v-if="pronouns">{{ pronouns }}</p>
</template>

<style scoped>
p {
	display: inline-block;
	width: fit-content;
	padding: calc(.05rem * v-bind(scale)) calc(.5rem * v-bind(scale));
	font-size: calc(3.25rem * v-bind(scale));
	background-color: hsla(276, 45%, 60%, 0.8);
	text-shadow: none;
}
</style>

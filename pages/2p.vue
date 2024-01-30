<script setup lang="ts">
import { useRun } from '../composables/run';
import FeedRow from '../components/FeedRow.vue';

const { activeRun } = useRun()
</script>

<template>
	<div>
		<p class="round">{{ activeRun?.category || "Unknown Round" }}</p>
		<FeedRow :first-player="0" :timer="true" />
	</div>
</template>

<style>
	p {
		color: white;
	}
</style>

<style scoped>
.round {
	display: block;
	width: 100%;
	text-align: center;
	margin: 0;
	padding: 0;
}
</style>

<script setup lang="ts">
import { useRun } from '../composables/run';
import FeedRow from '../components/FeedRow.vue';

const { activeRun } = useRun()
</script>

<template>
	<div class="body">
		<p class="round">{{ activeRun?.category || "Unknown Round" }}</p>
		<FeedRow class="feed" :scale="1" :first-player="0" :timer="true" />
	</div>
</template>

<style scoped>
.body {
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-start;
	color: white;
	font-size: 3.5rem;
}
.round {
	text-align: center;
	margin: 0;
	padding: 0;
	background-color: #454545cc;
	font-weight: 700;
	font-size: 3rem;
}
.feed {
	width: 100%;
}
</style>

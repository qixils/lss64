<script setup lang="ts">
import Round from '../components/Round.vue';
import FeedRow from '../components/FeedRow.vue';

const feedScale = 0.9;
</script>

<template>
	<div class="body">
		<Round :scale="1" />
		<FeedRow class="feed" :ar="16/9" :scale="feedScale" :first-player="0" :timer="true" />
	</div>
</template>

<style scoped>
.body {
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-start;
	color: white;
	font-size: calc(3.5rem * v-bind(feedScale));
}
.feed {
	width: 100%;
}
</style>

<script setup lang="ts">
import Round from '../components/Round.vue';
import FeedRow from '../components/FeedRow.vue';
</script>

<template>
	<div class="body">
		<Round :scale="1" />
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
.feed {
	width: 100%;
}
</style>

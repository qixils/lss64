<script setup lang="ts">
import Round from '../components/Round.vue';
import FeedRow from '../components/FeedRow.vue';
import Timer from '../components/Timer.vue';
</script>

<template>
	<div class="body">
		<Round :scale="1.1" class="round" />
		<FeedRow class="feed" :ar="16/9" :scale="0.75" :first-player="0" :timer="false" />
		<FeedRow class="feed" :ar="16/9" :scale="0.75" :first-player="2" :timer="false" />
		<Timer :scale="1.1" :dynamic-width="true" />
	</div>
</template>

<style scoped>
.body {
	width: calc(1920px - 27.5rem);
	font-size: calc(3.5rem  * 0.75);
	color: white;
}
</style>

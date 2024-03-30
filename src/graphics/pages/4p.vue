<script setup lang="ts">
import Round from '../components/Round.vue';
import FeedRow from '../components/FeedRow.vue';
import Timer from '../components/Timer.vue';
</script>

<template>
	<div class="body">
		<div class="feeds">
			<FeedRow :ar="4/3" :scale="0.5" :first-player="0" :timer="false" />
			<FeedRow :ar="4/3" :scale="0.5" :first-player="2" :timer="false" />
		</div>
		<div class="bars">
			<Round :scale="1" />
			<Timer :scale="1" :dynamic-width="true" />
		</div>
	</div>
</template>

<style>
html, body, #__nuxt, .root {
	width: 100vw;
	height: 100vh;
}
</style>

<style scoped>
.body {
	display: grid;
	grid-template-columns: calc(320px * 4 + 63px) 1fr;
	font-size: calc(3.5rem * 0.5);
	color: white;
}
.bars {
	padding-top: 20rem;
}
</style>

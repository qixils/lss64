<script setup lang="ts">
import Round from '../components/Round.vue';
import FeedRow from '../components/FeedRow.vue';
</script>

<template>
	<div class="body horiz">
		<div class="feeds vert">
			<FeedRow class="feed" :scale="0.5" :first-player="0" :timer="false" />
			<FeedRow class="feed" :scale="0.5" :first-player="2" :timer="false" />
		</div>
		<div class="grow">
			<div class="bar">
				<Round :scale="1.33" bg-color="#00000000" class="round" />
				<Timer :scale="1" bg-color="#00000000" :dynamic-width="true" />
			</div>
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
.horiz > div {
	height: 100vh;
}
.horiz {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-flow: row nowrap;
	font-size: calc(3.5rem / 2);
	color: white;
}
.feeds {
	flex-basis: calc(320px * 4 + 63px);
}
.feed {
	flex-basis: 50%;
	width: 100%;
}
.vert {
	display: flex;
	flex-flow: column nowrap;
}
.grow {
	flex-grow: 1;
}
.bar {
	margin-top: 20rem;
	width: 100%;
	height: 4.5rem;
	background-color: hsla(276, 20%, 27%, 0.8);
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-evenly;
}
.round {
	line-height: 4.25rem;
}
</style>

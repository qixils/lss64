<script setup lang="ts">
import Timer from './Timer.vue';
import Player from './Player.vue';

const props = defineProps<{
	firstPlayer: number
}>()
</script>

<template>
	<div>
		<div class="feeds">
			<div class="feed">
				<Timer :player="firstPlayer + 0" :inline="true" alignment="left" />
			</div>
			<div class="feed">
				<Timer :player="firstPlayer + 1" :inline="true" alignment="right" />
			</div>
		</div>
		<div class="bar">
			<Player class="player" :player="firstPlayer" />
			<Timer />
			<Player class="player" :player="firstPlayer + 1" />
		</div>
	</div>
</template>

<style scoped>
.feeds {
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
}

.feed {
	display: block;
	/*background-color: black;*/
	aspect-ratio: 4 / 3;
	width: calc(320px * 4);
}

.bar {
	display: flex;
	flex-direction: row nowrap;
	height: 4em;
}

.player {
	flex-grow: 1;
}
</style>

<script setup lang="ts">
import Timer from './Timer.vue';
import Player from './Player.vue';

const props = defineProps<{
	scale: number,
	firstPlayer: number,
	timer: boolean,
}>()
</script>

<template>
	<div>
		<div class="feeds">
			<div class="feed">
				<Timer :scale="scale" :player="firstPlayer + 0" :inline="true" alignment="left" />
			</div>
			<div class="feed">
				<Timer :scale="scale" :player="firstPlayer + 1" :inline="true" alignment="right" />
			</div>
		</div>
		<div class="bar" :class="{ 'bar-timerless': !timer }">
			<Player :scale="scale" class="player" :player="firstPlayer" />
			<Timer :scale="scale" v-if="timer" />
			<Player :scale="scale" class="player" :player="firstPlayer + 1" alignment="right" />
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
	aspect-ratio: 4 / 3;
	width: 50%;
}

.bar {
	display: grid;
	grid-template-columns: auto 1fr auto 1fr auto;
	height: calc(4.5rem * v-bind(scale));
}

.bar-timerless {
	grid-template-columns: auto 1fr 1fr auto;
}
</style>

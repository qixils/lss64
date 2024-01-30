<script setup lang="ts">
import { computed } from 'vue';
import { useRun } from '../composables/run';
import { useTimer } from '../composables/timer';

const props = defineProps<{
	scale: number,
	player?: number,
	inline?: boolean,
	alignment?: "left" | "right",
}>()

const { activeRun } = useRun()
const { timer } = useTimer()

const active = computed<Boolean>(() => {
	if (props.player === undefined) return true
	if (!activeRun.value) return false
	if (!timer.value) return false

	const team = activeRun.value.teams[props.player]
	return team.id in timer.value.teamFinishTimes
})

const winState = computed<"win" | "loss" | undefined>(() => {
	if (props.player === undefined) return undefined
	if (!activeRun.value) return undefined
	if (!timer.value) return undefined

	const team = activeRun.value.teams[props.player]
	const time = timer.value.teamFinishTimes[team.id]
	const opponent = activeRun.value.teams[(props.player % 2 === 0) ? (props.player + 1) : (props.player - 1)]
	const oppTime = timer.value.teamFinishTimes[opponent.id]
	if (!oppTime || oppTime.state === "forfeit") return "win"
	if (!time || time.state === "forfeit") return "loss"
	return time.milliseconds < oppTime.milliseconds ? "win" : "loss"
})
</script>

<template>
	<div class="another-container">
		<div class="timer"
			:class="[{ 'timer-out': !inline, 'timer-inline': inline, 'timer-hide': !active }, alignment ? `timer-${alignment}` : '', winState ? `timer-${winState}` : '']">
			<p class="nested" :class="{ 'nested-inline': inline }">{{ timer?.time }}</p> <!-- TODO: add a default -->
		</div>
	</div>
</template>

<style scoped>
.another-container {
	margin: 0;
	padding: 0;
	height: 100%;
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-end;
}

.timer {
	background-color: #2e2e2ecc;
	transition: opacity 0.2s;
	width: fit-content;
	font-family: 'Ubuntu Mono';
	font-size: calc(4.3rem * v-bind(scale));
}

.timer-hide {
	opacity: 0;
}

.timer-out {
	height: 100%;
}

.timer-inline {
	margin-top: auto;
	margin-bottom: 0;
}

.timer-left {
	margin-left: 0;
	margin-right: auto;
}

.timer-right {
	margin-left: auto;
	margin-right: 0;
}

.timer-win {
	background-color: rgba(0, 220, 0, 0.8);
}

.timer-loss {
	background-color: rgba(220, 0, 0, 0.8);
}

.nested {
	margin: 0;
	padding-left: calc(1rem * v-bind(scale));
	padding-right: calc(1rem * v-bind(scale));
}

.nested-inline {
	padding-top: calc(0.5rem * v-bind(scale));
	padding-bottom: calc(0.5rem * v-bind(scale));
}
</style>

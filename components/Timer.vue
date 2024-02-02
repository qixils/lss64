<script setup lang="ts">
import { computed } from 'vue';
import { useRun } from '../composables/run';
import { useTimer } from '../composables/timer';

const props = defineProps<{
	scale: number,
	player?: number,
	inline?: boolean,
	alignment?: "left" | "right",
	bgColor?: string,
	dynamicWidth?: boolean,
}>()

const bgColorDef = computed<String>(() => props.bgColor ?? "#312537cc" )

const { activeRun } = useRun()
const { timer } = useTimer()
const timeStr = computed<String>(() => {
	let time: {time: String} | undefined = timer.value
	if (props.player !== undefined && activeRun.value && timer.value) {
		const team = activeRun.value.teams[props.player]
		if (team.id in timer.value.teamFinishTimes) {
			time = timer.value.teamFinishTimes[team.id]
		}
	}
	return (time?.time ?? "00:00:00").substring(1)
})

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
	if (!time || time.state === "forfeit") return "loss"
	const opponent = activeRun.value.teams[(props.player % 2 === 0) ? (props.player + 1) : (props.player - 1)]
	const oppTime = timer.value.teamFinishTimes[opponent.id]
	if (!oppTime || oppTime.state === "forfeit") return "win"
	return time.milliseconds < oppTime.milliseconds ? "win" : "loss"
})
</script>

<template>
	<div class="another-container">
		<div class="timer"
			:class="[{ 'timer-out': !inline, 'timer-inline': inline, 'timer-hide': !active, 'manual-size': !dynamicWidth }, alignment ? `timer-${alignment}` : '', winState ? `timer-${winState}` : '', (player === undefined) ? `timer-state-${timer?.state ?? 'stopped'}` : '' ]">
			<p class="nested" :class="{ 'nested-inline': inline }">{{ timeStr }}</p> <!-- TODO: add a default -->
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
	background-color: v-bind(bgColorDef);
	transition: opacity 0.2s;
	font-family: 'Ubuntu Mono';
	font-size: calc(4.3rem * v-bind(scale));
}

.manual-size {
	width: fit-content;
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
	background-color: hsla(120, 100%, 43%, 0.8);
}

.timer-loss {
	background-color: hsla(0, 100%, 43%, 0.8);
}

.nested {
	margin: 0;
	padding-left: calc(1rem * v-bind(scale));
	padding-right: calc(1rem * v-bind(scale));
	text-align: center;
}

.nested-inline {
	padding-top: calc(0.5rem * v-bind(scale));
	padding-bottom: calc(0.5rem * v-bind(scale));
}

.timer-state-stopped, .timer-state-paused {
	color: #ccc;
}

.timer-state-finished {
	color: #adffb2;
}
</style>

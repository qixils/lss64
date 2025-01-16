<script setup lang="ts">
import { computed } from 'vue';
import { useRun } from '../composables/run';
import { useTimer } from '../composables/timer';
import type { Timer } from 'nodecg-speedcontrol/src/types';

const props = defineProps<{
  scale: number,
  player?: number,
  bgColor?: string,
  customTime?: string,
  alwaysActive?: boolean,
}>()

const bgColorDef = computed<String>(() => props.bgColor ?? "#312537cc")

const { activeRun } = useRun()
const { timer } = useTimer()
const timeStr = computed<string>(() => {
  let time: Pick<Timer, 'time'> | undefined
  if (props.customTime) {
    time = { time: props.customTime }
  } else {
    time = timer.value
    if (props.player !== undefined && activeRun.value && timer.value) {
      const team = activeRun.value.teams[props.player]
      if (team.id in timer.value.teamFinishTimes) {
        time = timer.value.teamFinishTimes[team.id]
      }
    }
  }
  let out = time?.time ?? "00:00:00"
  while ((out.startsWith('0') || out.startsWith(':')) && out.length > 5) {
    out = out.substring(1)
  }
  return out
})

const active = computed<Boolean>(() => {
  if (props.alwaysActive) return true
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
  <div class="timer"
    :class="[{ 'timer-hide': !active }, winState ? `timer-${winState}` : '', (player === undefined) ? `timer-state-${timer?.state ?? 'stopped'}` : '']">
    <p class="nested">{{ timeStr }}</p>
  </div>
</template>

<style scoped>
.timer {
  @apply flex items-center justify-center;
  /* TODO: transform */
  background-color: v-bind(bgColorDef);
  transition: opacity 0.2s;
  font-family: 'Ubuntu Mono';
  font-size: calc(4.3rem * v-bind(scale));
}

.timer-hide {
  opacity: 0;
}

.timer-win {
  background-color: hsla(120, 100%, 43%, 0.8);
}

.timer-loss {
  background-color: hsla(0, 100%, 43%, 0.8);
}

.nested {
  display: inline-block;
  text-align: center;
  line-height: 1;
}

.timer-state-stopped,
.timer-state-paused {
  color: #ccc;
}

.timer-state-finished {
  color: #adffb2;
}
</style>

import { ref, onMounted, onUnmounted } from 'vue'
import type { Timer } from 'nodecg-speedcontrol/src/types'
import type { ReplicantBrowser } from 'nodecg/types/browser'
import { createSharedComposable } from '@vueuse/core'

interface Duration {
  weeks?: number
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
}

export const timeToSeconds = (duration: Duration | string): number => {
  if (typeof duration === 'string') {
    const [hours, minutes, seconds] = duration.split(":").map(value => {
      const conv = parseInt(value)
      if (isNaN(conv)) return 0
      return conv
    })
    duration = { hours, minutes, seconds }
  }

  // weeks
  let output = duration.weeks || 0
  // convert to days
  output *= 7
  output += duration.days || 0
  // convert to hours
  output *= 24
  output += duration.hours || 0
  // convert to minutes
  output *= 60
  output += duration.minutes || 0
  // convert to seconds
  output *= 60
  output += duration.seconds || 0

  return output
}

export const timeToString = (duration: Duration) => {
  const input = timeToSeconds(duration)
  const hours = Math.floor(input / 3600)
  const minutes = Math.floor((input % 3600) / 60)
  const seconds = input % 60
  return [hours, minutes, seconds].map(time => time.toFixed(0).padStart(2, "0")).join(":")
}

export const useTimer = createSharedComposable(() => {
	const timer = ref<Timer | undefined>()

	function setActiveTimer(newVal: Timer | undefined, oldVal: Timer | undefined) {
		if (!newVal) return
		timer.value = { ...newVal }
	}

	let listener: ReplicantBrowser<Timer>

	onMounted(() => {
		listener = nodecg.Replicant('timer', 'nodecg-speedcontrol')
		listener.on('change', setActiveTimer)
	})

	onUnmounted(() => {
		if (listener) listener.off('change', setActiveTimer)
	})

	return {
    timer,
    timeToString,
  }
})

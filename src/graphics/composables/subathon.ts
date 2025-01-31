import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { ReplicantBrowser } from 'nodecg/types/browser'
import type { SubathonState, Supporter } from '../../types'
import { safeStringify } from '../utils/clone'
import { createSharedComposable } from '@vueuse/core'
import { timeToSeconds, timeToString } from './timer'
import { replicant } from '../../browser/utils/replicant'

export const useSubathon = createSharedComposable(() => {
	const subathon = replicant<SubathonState>('subathonState')

  // properties

  const realSeconds = computed(() => timeToSeconds(subathon.value?.goal || "09:59:59"))
  const displaySeconds = ref(0)
  const animatingFrom = ref(-1)
  const goal = computed(() => timeToString({ seconds: displaySeconds.value }))
  const percentile = computed(() => subathon.value?.percentile ?? 99.9)
  const percentileStr = computed(() => percentile.value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%')
  const supporters = computed<Supporter[]>((previous) => {
    const newValue = subathon.value?.supporters ?? []
    console.log("supporters update", newValue, previous)
    if (!previous) return newValue
    if (previous.length !== newValue.length) return newValue
    for (let i = 0; i < newValue.length; i++) {
      if (safeStringify(previous[i]) !== safeStringify(newValue[i])) return newValue
    }
    return previous // avoid triggering updates
  })

  onMounted(() => {
    setInterval(() => {
      if (animatingFrom.value === -1) {
        if (displaySeconds.value !== realSeconds.value) {
          animatingFrom.value = displaySeconds.value
        } else {
          return
        }
      }

      // we are animating!
      // TODO: easing?
      const increment = Math.round((realSeconds.value - animatingFrom.value) * 0.2)
      const newValue = animatingFrom.value + increment
      if (Math.abs(realSeconds.value - newValue) <= 3) {
        animatingFrom.value = -1
        displaySeconds.value = realSeconds.value
      } else {
        displaySeconds.value = newValue
      }
    }, 100)
  })

	return {
    subathon,
    subathonGoal: goal,
    subathonPercentile: percentile,
    subathonPercentileStr: percentileStr,
    subathonSupporters: supporters,
  }
})

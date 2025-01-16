import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { ReplicantBrowser } from 'nodecg/types/browser'
import type { SubathonState, Supporter } from '../../types'
import { safeStringify } from '../utils/clone'

export function useSubathon() {
	const subathon = ref<SubathonState | undefined>()

  // boilerplate

	function setActiveSubathon(newVal: SubathonState | undefined, oldVal: SubathonState | undefined) {
    console.log("subathon update", newVal, oldVal)
    if (safeStringify(newVal) === safeStringify(subathon.value)) return
		subathon.value = newVal ? { ...newVal } : undefined
	}

	let listener: ReplicantBrowser<SubathonState>

	onMounted(() => {
		listener = nodecg.Replicant('subathonState')
		listener.on('change', setActiveSubathon)
	})

	onUnmounted(() => {
		if (listener) listener.off('change', setActiveSubathon)
	})

  // properties

  const realSeconds = computed(() => {
    const time = subathon.value?.goal ?? "09:59:59"
    const [hours, minutes, seconds] = time.split(":").map(value => {
      const conv = parseInt(value)
      if (isNaN(conv)) return 0
      return conv
    })
    return (((hours * 60) + minutes) * 60) + seconds
  })
  const displaySeconds = ref(0)
  const animatingFrom = ref(-1)
  const goal = computed(() => {
    const hours = Math.floor(displaySeconds.value / 3600)
    const minutes = Math.floor((displaySeconds.value % 3600) / 60)
    const seconds = displaySeconds.value % 60
    return [hours, minutes, seconds].map(time => time.toFixed(0).padStart(2, "0")).join(":")
  })
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
}

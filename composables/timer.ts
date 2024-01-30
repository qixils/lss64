import { ref, onMounted, onUnmounted } from 'vue'
import type { Timer } from 'nodecg-speedcontrol/src/types'
import type { ReplicantBrowser } from 'nodecg/types/browser'

export function useTimer() {
	const timer = ref<Timer | undefined>()

	function setActiveTimer(newVal: Timer | undefined, oldVal: Timer | undefined) {
		if (newVal) {
			timer.value = newVal
		}
	}

	let listener: ReplicantBrowser<Timer>

	onMounted(() => {
		listener = nodecg.Replicant('timer', 'nodecg-speedcontrol')
		listener.on('change', setActiveTimer)
	})

	onUnmounted(() => {
		if (listener) listener.off('change', setActiveTimer)
	})

	return { timer }
}

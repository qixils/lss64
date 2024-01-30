import { ref, onMounted, onUnmounted } from 'vue'
import type { RunDataActiveRun } from 'nodecg-speedcontrol/src/types'
import type { ReplicantBrowser } from 'nodecg/types/browser'

export function useRun() {
	const activeRun = ref<RunDataActiveRun>()

	function setActiveRun(newVal: RunDataActiveRun, oldVal: RunDataActiveRun) {
		if (newVal) {
			activeRun.value = newVal
		}
	}

	let listener: ReplicantBrowser<RunDataActiveRun>

	onMounted(() => {
		listener = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol')
		listener.on('change', setActiveRun)
	})

	onUnmounted(() => {
		if (listener) listener.off('change', setActiveRun)
	})

	return { activeRun }
}

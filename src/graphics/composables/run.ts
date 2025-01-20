import { ref, onMounted, onUnmounted } from 'vue'
import type { RunDataActiveRun } from 'nodecg-speedcontrol/src/types'
import type { ReplicantBrowser } from 'nodecg/types/browser'
import { createSharedComposable } from '@vueuse/core'

export const useRun = createSharedComposable(() => {
	const activeRun = ref<RunDataActiveRun>()

	function setActiveRun(newVal: RunDataActiveRun, oldVal: RunDataActiveRun) {
		if (!newVal) return
		activeRun.value = { ...newVal }
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
})

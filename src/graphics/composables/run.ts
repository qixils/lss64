import { ref, onMounted, onUnmounted } from 'vue'
import type { RunDataActiveRun } from 'nodecg-speedcontrol/src/types'
import type { ReplicantBrowser } from 'nodecg/types/browser'
import { createSharedComposable } from '@vueuse/core'
import { replicant } from '../../browser/utils/replicant'

export const useRun = createSharedComposable(() => {
	const activeRun = replicant<RunDataActiveRun>('runDataActiveRun@nodecg-speedcontrol')

	return { activeRun }
})

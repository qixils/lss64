import { ref, onMounted, onUnmounted } from 'vue'
import type { RunDataActiveRun } from 'nodecg-speedcontrol/src/types'
import type { ReplicantBrowser } from 'nodecg/types/browser'
import { createSharedComposable, refDefault } from '@vueuse/core'
import { replicant } from '../../browser/utils/replicant'
import type { LobbyRoyaleUser } from '../../types'

export const useRoyale = createSharedComposable(() => {
	const players = refDefault(replicant<LobbyRoyaleUser[]>('royalePlayers'), [])
	const showing = refDefault(replicant<LobbyRoyaleUser[]>('royaleShowing'), [])
	const ignored = refDefault(replicant<Pick<LobbyRoyaleUser, 'ccUID' | 'name'>[]>('royaleIgnored'), [])

	return {
    players,
    showing,
    ignored,
  }
})

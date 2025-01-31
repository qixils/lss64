import { ref, onMounted, onUnmounted } from 'vue'
import type { RunDataActiveRun } from 'nodecg-speedcontrol/src/types'
import type { ReplicantBrowser } from 'nodecg/types/browser'
import { createSharedComposable, refDefault } from '@vueuse/core'
import { replicant, voidMessager } from '../../browser/utils/replicant'
import type { LobbyRoyaleUser } from '../../types'

export const useReplicants = createSharedComposable(() => {
	const players = refDefault(replicant<LobbyRoyaleUser[]>('royalePlayers'), [])
	const showing = refDefault(replicant<LobbyRoyaleUser[]>('royaleShowing'), [])
	const pending = refDefault(replicant<LobbyRoyaleUser[]>('royalePending'), [])
	const ignored = refDefault(replicant<Pick<LobbyRoyaleUser, 'ccUID' | 'name'>[]>('royaleIgnored'), [])
  const sendUpdatePlayers = voidMessager('updatePlayers')

	return {
    players,
    showing,
    pending,
    ignored,
    sendUpdatePlayers,
  }
})

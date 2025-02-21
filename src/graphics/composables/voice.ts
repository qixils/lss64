import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { ReplicantBrowser } from 'nodecg/types/browser'
import type { ChannelVoiceStatus } from '../../types'
import { createSharedComposable } from '@vueuse/core'
import { RunDataCommentator } from 'nodecg-speedcontrol/src/types'
import { useRun } from './run'

export const useVoice = createSharedComposable(() => {
  const { activeRun } = useRun()

	const channelVoiceStatus = ref<ChannelVoiceStatus>({ users: {} })

	function setActiveStatus(newVal: ChannelVoiceStatus, oldVal: ChannelVoiceStatus) {
		if (!newVal) return
		channelVoiceStatus.value = { ...newVal }
	}

	let listener: ReplicantBrowser<ChannelVoiceStatus>

	onMounted(() => {
		listener = nodecg.Replicant('channelVoiceStatus')
		listener.on('change', setActiveStatus)
	})

	onUnmounted(() => {
		if (listener) listener.off('change', setActiveStatus)
	})

  const commentators = computed(() => {
    const users: RunDataCommentator[] = activeRun.value?.commentators ?? activeRun.value?.teams?.find(team => team.name === "Commentators")?.players ?? []
    return users.map(commentator => {
      const discord = commentator.customData.discord
      return {
        ...commentator,
        discord: discord ? channelVoiceStatus.value.users[discord] : undefined,
      }
    })
  })

	return { channelVoiceStatus, commentators }
})

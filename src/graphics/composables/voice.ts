import { ref, onMounted, onUnmounted } from 'vue'
import type { ReplicantBrowser } from 'nodecg/types/browser'
import type { ChannelVoiceStatus } from '../../types'
import { createSharedComposable } from '@vueuse/core'

export const useVoice = createSharedComposable(() => {
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

	return { channelVoiceStatus }
})

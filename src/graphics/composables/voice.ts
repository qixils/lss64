import { ref, onMounted, onUnmounted } from 'vue'
import type { ReplicantBrowser } from 'nodecg/types/browser'
import type { ChannelVoiceStatus } from '../../types'

export function useVoice() {
	const channelVoiceStatus = ref<ChannelVoiceStatus>()

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
}

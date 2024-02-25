export interface ChannelVoiceStatus {
	users: {
		[username: string]: UserVoiceStatus;
	};
}

export interface UserVoiceStatus {
	talking: boolean; // TODO: waveform volume ?
}

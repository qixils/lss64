export interface ChannelVoiceStatus {
	users: {
		[username: string]: UserVoiceStatus;
	};
}

export interface UserVoiceStatus {
	speaking: boolean; // TODO: waveform volume ?
	mute: boolean;
	deaf: boolean;
	pfp: string;
}

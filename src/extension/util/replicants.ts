/* eslint-disable max-len */

import type { ChannelVoiceStatus, LobbyRoyaleUser, SubathonState } from '../../types';
import { get as nodecg } from './nodecg';

/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */

export const channelVoiceStatus = nodecg().Replicant<ChannelVoiceStatus>('channelVoiceStatus', { persistent: false, persistenceInterval: 100 })
export const subathonState = nodecg().Replicant<SubathonState>('subathonState')

export const royalePlayers = nodecg().Replicant<LobbyRoyaleUser[]>('royalePlayers')
export const royaleShowing = nodecg().Replicant<LobbyRoyaleUser[]>('royaleShowing')
export const royaleIgnored = nodecg().Replicant<string[]>('royaleIgnored')

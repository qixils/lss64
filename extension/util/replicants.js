"use strict";
/* eslint-disable max-len */
Object.defineProperty(exports, "__esModule", { value: true });
exports.royaleIgnored = exports.royaleShowing = exports.royalePlayers = exports.subathonState = exports.channelVoiceStatus = void 0;
const nodecg_1 = require("./nodecg");
/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
exports.channelVoiceStatus = (0, nodecg_1.get)().Replicant('channelVoiceStatus', { persistent: false, persistenceInterval: 100 });
exports.subathonState = (0, nodecg_1.get)().Replicant('subathonState');
exports.royalePlayers = (0, nodecg_1.get)().Replicant('royalePlayers');
exports.royaleShowing = (0, nodecg_1.get)().Replicant('royaleShowing');
exports.royaleIgnored = (0, nodecg_1.get)().Replicant('royaleIgnored');

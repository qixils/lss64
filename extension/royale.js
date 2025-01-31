"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const types_1 = require("../types");
const replicants_1 = require("./util/replicants");
const nodecg_1 = require("./util/nodecg");
const nodecg = (0, nodecg_1.get)();
const baseUrl = new URL('https://openapi.crowdcontrol.live');
const updatePlayers = async () => {
    const result = zod_1.default.array(types_1.LobbyRoyaleUserSchema).safeParse(await fetch(new URL("/royale/game", baseUrl)).then(r => r.json()));
    if (!result.success)
        return;
    replicants_1.royalePlayers.value = result.data;
};
nodecg.listenFor('updatePlayers', updatePlayers);

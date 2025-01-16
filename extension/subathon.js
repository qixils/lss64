"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_1 = require("./util/nodecg");
const helpers_1 = require("./util/helpers");
const replicants_1 = require("./util/replicants");
const nodecg = (0, nodecg_1.get)();
const config = (0, helpers_1.bundleConfig)();
// TODO: if
replicants_1.subathonState.value = {
    goal: "09:59:59",
    percentile: 99.9,
    supporters: [],
};
let supporterIndex = replicants_1.subathonState.value.supporters[0]?.index ?? 0;
const goals = [];
const updateGoal = () => {
    if (goals.length < 1000)
        return;
};
const pushSupporter = (supporter) => {
    // TODO: update goal
    const supporters = [supporter, ...replicants_1.subathonState.value.supporters];
    while (supporters.length > 15) {
        supporters.pop();
    }
    replicants_1.subathonState.value = { ...replicants_1.subathonState.value, supporters };
    console.log("Pushed", supporter, "to", supporters);
};
setInterval(() => {
    pushSupporter({
        action: "sub",
        amount: 1,
        index: ++supporterIndex,
        user: "lexikiq",
    });
}, 2000);

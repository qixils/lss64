"use strict";
/* eslint-disable global-require */
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_1 = require("./util/nodecg");
exports.default = (nodecg) => {
    /**
     * Because of how `import`s work, it helps to use `require`s to force
     * things to be loaded *after* the NodeCG context is set.
     */
    (0, nodecg_1.set)(nodecg);
    require('./voice');
};

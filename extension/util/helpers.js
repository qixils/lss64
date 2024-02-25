"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleConfig = void 0;
const nodecg_1 = require("./nodecg");
const nodecg = (0, nodecg_1.get)();
/**
 * Returns this bundle's configuration along with the correct typings.
 */
function bundleConfig() {
    return nodecg.bundleConfig;
}
exports.bundleConfig = bundleConfig;

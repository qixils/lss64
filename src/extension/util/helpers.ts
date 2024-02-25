import type { Config } from "../../types";
import { get } from "./nodecg";

const nodecg = get();

/**
 * Returns this bundle's configuration along with the correct typings.
 */
export function bundleConfig(): Config {
	return nodecg.bundleConfig;
}


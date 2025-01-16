/* eslint-disable global-require */

// This must go first so we can use module aliases!
/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
//require('module-alias').addAlias('@lss64', require('path').join(__dirname, '.'));

import type { NodeCG } from 'nodecg/types/server';
import { set } from './util/nodecg';

export default (nodecg: NodeCG) => {
  /**
   * Because of how `import`s work, it helps to use `require`s to force
   * things to be loaded *after* the NodeCG context is set.
   */
  set(nodecg);
  try {
    require('./voice');
  } catch (e) {
    console.error("Failed to activate Discord", e)
  }
  require('./subathon');
};

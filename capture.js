/* eslint-disable no-console */

const Readline = require('readline');

// setup key listen
Readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

console.log('Press Space to capture Frame');

// on keypress
process.stdin.on('keypress', (str, key) => {
  // if ctrl + c stop else output data
  if (key.ctrl && key.name === 'c') {
    console.log('exiting...');
    process.exit();
  } else {
    console.log('Frame captured!');
  }
});

/* eslint-disable no-console */

const Readline = require('readline');
const Leap = require('leapjs');

let leapConnected = false;

// setup key listen
Readline.emitKeypressEvents(process.stdin);
// TODO: this throws error, might be worth to change input method to redStream
process.stdin.setRawMode(true);

// controller is main leap motion main interface
const Controller = new Leap.Controller();
// start listener
Controller.connect();

// listener event

// leap connected to websocket!
Controller.on('connect', () => {
  console.log('leap connected to websocket!');
});

// leap started sending data!
Controller.on('deviceStreaming', () => {
  console.log('leap is sending data!');
  console.log('----------------------------');
  console.log('press space to capture frame data!');
  leapConnected = true;
});


// setting up keypress Event
process.stdin.on('keypress', (str, key) => {
  // only when leap is connected
  if (!leapConnected) return;

  // if ctrl + c stop else output data
  if (key.ctrl && key.name === 'c') {
    console.log('exiting...');
    process.exit();
  } else {
    console.log('Frame captured!');
  }
});

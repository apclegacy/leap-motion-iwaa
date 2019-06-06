/* eslint-disable no-console */

const Readline = require('readline');
const Leap = require('leapjs');

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
});

let previousA;
let previousB;
let previousC;
let previousX;
let previousY;
let previousZ;
let firstIteration = true;

// setting up keypress Event
process.stdin.on('keypress', (str, key) => {
  // if ctrl + c stop else output data
  if (key.ctrl && key.name === 'c') {
    console.log('exiting...');
    process.exit();
  } else if (key.name === 'space') {
    // only when leap is connected
    if (!Controller.connected()) return;

    const [Hand] = Controller.frame().hands.filter(h => h.type === 'right');
    if (Hand == null) {
      console.log('not right hand');
      return;
    }

    const Thumb = Hand.thumb;

    const [actualX, actualY, actualZ] = Thumb.dipPosition;
    const actualA = Hand.roll();
    const actualB = Hand.yaw();
    const actualC = Hand.pitch();

    let deltaX;
    let deltaY;
    let deltaZ;
    let deltaA;
    let deltaB;
    let deltaC;

    if (firstIteration) {
      deltaX = actualX;
      deltaY = actualY;
      deltaZ = actualZ;
      deltaA = actualA;
      deltaB = actualB;
      deltaC = actualC;
      firstIteration = false;
    } else {
      deltaX = previousX - actualX;
      deltaY = previousY - actualY;
      deltaZ = previousZ - actualZ;
      deltaA = previousA - actualA;
      deltaB = previousB - actualB;
      deltaC = previousC - actualC;
    }

    console.log('--------------------');
    console.log('thumb X delta');
    console.log(deltaX);
    console.log('thumb Y delta');
    console.log(deltaY);
    console.log('thumb Z delta');
    console.log(deltaZ);
    console.log('a rotation delta');
    console.log(deltaA);
    console.log('b rotation delta');
    console.log(deltaB);
    console.log('c rotation delta');
    console.log(deltaC);

    previousA = actualA;
    previousB = actualB;
    previousC = actualC;
    previousX = actualX;
    previousY = actualY;
    previousZ = actualZ;
  }
});

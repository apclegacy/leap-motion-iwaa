/* eslint-disable no-use-before-define */
/* eslint-disable no-console */

const Readline = require('readline');
const Leap = require('leapjs');
const FileStream = require('fs');

let iwaaZ;
let iwaaX;
let iwaaY;
let iwaaB;
let iwaaC;
let iwaaA;

const Frames = [];

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
  console.log('press ctrl + c to exit!');
  console.log('press w to write json data!');
  console.log('//////////');
});

let previousA = 0;
let previousB = 0;
let previousC = 0;
let previousX = 0;
let previousY = 0;
let previousZ = 0;

// setting up keypress Event
process.stdin.on('keypress', (str, key) => {
  // if ctrl + c stop else output data
  if (key.ctrl && key.name === 'c') {
    console.log('exiting...');
    process.exit();
  } else if (key.name === 'w') {
    console.log('writing output...');
    jsonifyOutput();
  } else if (key.name === 'space') {
    // only when leap is connected
    if (!Controller.connected()) return;

    const [Hand] = Controller.frame().hands.filter(h => h.type === 'right');
    if (Hand == null) {
      console.log('NO RIGHT HAND');
      return;
    }

    const Thumb = Hand.thumb;

    const [actualX, actualY, actualZ] = Thumb.dipPosition;
    const actualA = Hand.roll();
    const actualB = Hand.yaw();
    const actualC = Hand.pitch();

    const deltaX = previousX - actualX;
    const deltaY = previousY - actualY;
    const deltaZ = previousZ - actualZ;
    const deltaA = previousA - actualA;
    const deltaB = previousB - actualB;
    const deltaC = previousC - actualC;

    previousX = actualX;
    previousY = actualY;
    previousZ = actualZ;
    previousA = actualA;
    previousB = actualB;
    previousC = actualC;

    if (previousA === 0) {
      console.log('BASE FRAME');
      console.log('//////////');
      return;
    }

    iwaaZ = deltaX;
    iwaaX = deltaY;
    iwaaY = deltaZ;
    iwaaB = deltaA;
    iwaaC = deltaB;
    iwaaA = deltaC;

    console.log('NEW FRAME');
    console.log('---------');
    console.log(`delta X: ${iwaaX}`);
    console.log(`delta Y: ${iwaaY}`);
    console.log(`delta Z: ${iwaaZ}`);
    console.log(`delta A: ${iwaaA}`);
    console.log(`delta B: ${iwaaB}`);
    console.log(`delta C: ${iwaaC}`);
    console.log('//////////');

    persistFrame();
  }
});

function persistFrame() {
  Frames.push(new Frame(
    iwaaZ,
    iwaaX,
    iwaaY,
    iwaaB,
    iwaaC,
    iwaaA,
  ));
}

function jsonifyOutput() {
  const JsonOutput = JSON.stringify(Frames);
  FileStream.writeFileSync('./frames.json', `{ "frames": ${JsonOutput} }`);
}

class Frame {
  constructor(z, x, y, b, c, a) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.a = a;
    this.b = b;
    this.c = c;
  }
}

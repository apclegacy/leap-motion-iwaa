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

    console.log('hand position');
    console.log(Hand.palmPosition);
    console.log('thumb position');
    console.log(Thumb.dipPosition);
    console.log('a rotation');
    console.log(Hand.roll());
    console.log('b rotation');
    console.log(Hand.yaw());
    console.log('a rotation');
    console.log(Hand.roll());
  }
});

const Gpio = require('./gpio.js').Gpio;

const gpio16 = new Gpio(16, 'out');

gpio16.writeSync(1);
console.log('read ' + gpio16.readSync());

gpio16.writeSync(0);
console.log('read ' + gpio16.readSync());

gpio16.writeSync(Gpio.LOW);
console.log('read ' + gpio16.readSync());

gpio16.writeSync(Gpio.HIGH);
console.log('read ' + gpio16.readSync());

gpio16.writeSync(1);
console.log('read ' + gpio16.readSync());

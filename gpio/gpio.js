const fs = require('fs');

const GPIO_ROOT_PATH = '/sys/class/gpio/';

const HIGH_BUF = Buffer.from('1');
const LOW_BUF = Buffer.from('0');

const HIGH = 1;
const LOW = 0;

const exportGpio = gpio => {
	if (!fs.existsSync(gpio._gpioPath)) {
		fs.writeFileSync(`${GPIO_ROOT_PATH}export`,
			'' + gpio._gpio);
		return false;
	}
	return true;
};

const configureGpio = (
	gpio, direction, edge, options, gpioPreviouslyExported) => {

	const throwIfNeeded = err => {
		if (gpioPreviouslyExported === false) {
			throw err;
		}
	};

	try {
		if (typeof options.activeLow === 'boolean') {
			gpio.setActiveLow(options.activeLow);
		}
	}
	catch (err) {
		throwIfNeeded(err);
	}

	try {
		if (gpio.direction() !== direction) {
			gpio.setDirection(direction);
		}
	}
	catch (err) {
		throwIfNeeded(err);
	}

	try {
		if (edge && direction === 'in') {
			gpio.setEdge(edge);
		}
	}
	catch (err) {
		throwIfNeeded(err);
	}

};

class Gpio {

	constructor(gpio, direction, edge, options) {

		options = options || {};

		this._gpio = gpio;
		this._gpioPath = `${GPIO_ROOT_PATH}gpio${this._gpio}/`;
		this._readSyncBuffer = Buffer.alloc(16);

		const gpioPreviouslyExported = exportGpio(this);

		configureGpio(this, direction, edge, options, 
			gpioPreviouslyExported);

		this._valueFd = fs.openSync(this._gpioPath + 'value', 'r+');
	}

	readSync() {
		fs.readSync(this._valueFd, this._readSyncBuffer, 0, 1, 0);
		return convertBufferToBit(this._readSyncBuffer);
	}

	writeSync(value) {
		const writeBuffer = convertBitToBuffer(value);
		fs.writeSync(this._valueFd, writeBuffer, 0, writeBuffer.length, 0);
	} 

	direction() {
		return fs.readFileSync(`${this._gpioPath}direction`).toString().trim();
	}

	setDirection(direction) {
		fs.writeFileSync(`${this._gpioPath}direction`, direction);
	}

	edge() {
		return fs.readFileSync(`${this._gpioPath}edge`).toString().trim();		
	}

	setEdge(edge) {
		fs.writeFileSync(`${this._gpioPath}edge`, edge);
	}

	activeLow() {
		return convertBufferToBoolean(
			fs.readFileSync(`${this._gpioPath}active_low`)
		);
	}

	setActiveLow(invert) {
		fs.writeFileSync(
			`${this._gpioPath}active_low`);
	}

	unexport() {

		fs.closeSync(this._valueFd);
		try {
			fs.writeFileSync(`${GPIO_ROOT_PATH}unexport`, '' + this._gpio);
		}
		catch (ignore) {
			
		}
	}
};

const convertBitToBuffer = bit => convertBooleanToBuffer(bit === HIGH);
const convertBufferToBit = buffer => convertBufferToBoolean(buffer) ? HIGH : LOW;

const convertBooleanToBuffer = boolean => boolean ?	HIGH_BUF : LOW_BUF;
const convertBufferToBoolean = buffer => buffer[0] === HIGH_BUF[0];

Gpio.HIGH = HIGH;
Gpio.LOW = LOW;

module.exports.Gpio = Gpio;

// Mock gpio module for testing purposes

class Gpio {

	constructor(gpio, direction, edge, options) {
	}

	readSync() {
	}

	writeSync(value) {
	} 

	direction() {		
	}

	setDirection(direction) {		
	}

	edge() {		
	}

	setEdge(edge) {		
	}

	activeLow() {		
	}

	setActiveLow(invert) {		
	}

	unexport() {		
	}
};


module.exports.Gpio = Gpio;
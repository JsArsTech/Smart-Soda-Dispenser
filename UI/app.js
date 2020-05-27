const Vue = require('vue/dist/vue.common.js');
const axios = require('axios');
const child_process = require('child_process');
const fs = require('fs');

const Gpio = require('../gpio/gpio_mock').Gpio; 

let startDate;
const ubidotsHeader = {'X-Auth-Token': 'BBFF-gILxAFiZ8V87px1VzxpVZEcEvdkKjx',
	'Content-Type': 'application/json'};
const ubidotsURL = 'http://things.ubidots.com/api/v1.6/devices/raspberrypi';

var app = new Vue({
	el: '#app',
	data: {
		beverages: [
			{name: 'soda', bgcolor: 'darkred', wcolor: 'white',
				pinNumber: 16},
			{name:'juice', bgcolor: 'orange', wcolor: 'white',
				pinNumber: 20},
			{name: 'water', bgcolor: 'cornflowerblue', wcolor: 'white',
				pinNumber: 21}
		],
		selection: null,
		pouring: false
	},
	async created() {
		this.selection = this.beverages[0]; 
		let payload = {};

		for (let beverage of this.beverages) {
			beverage.pin = new Gpio(beverage.pinNumber, 'out');

			try {
				let result = await axios.post(`${ubidotsURL}/${beverage.name}/values`, 
					{ value: 2000.0 },
					{ headers: ubidotsHeader });
				console.log(result);
			}
			catch (err) {
				console.error(err);
			}


			/*
			payload[beverage.name] = 2000;
			try {
				let result = await axios.post(ubidotsURL,
					payload, { headers: ubidotsHeader });
				console.log(result);
			}			
			catch (err) {
				console.error(err);
			}
			*/
		}
	},
	methods: {
		select(element) {
			this.selection = element;
		},
		async pour(action) {

			if (action) {
				this.pouring = true;
				this.selection.pin.writeSync(Gpio.HIGH);
				startDate = Date.now();
			}
			else {
				this.pouring = false;
				this.selection.pin.writeSync(Gpio.LOW);
				let seconds = (Date.now() - startDate) / 1000;
				let mililiters = seconds * 10;
				let ubidotsVariable = {};
				
				
				try {
					let result = await axios.post(`${ubidotsURL}/${this.selection.name}/values`,
						{ value: -mililiters },
						{ headers: ubidotsHeader });
					console.log(result);
				}
				catch (err) {
					console.log(err);
				}

				/*
				ubidotsVariable[this.selection.name] = -mililiters;

				try {
					let result = await axios.post(ubidotsURL,
						ubidotsVariable, 
						{ headers: ubidotsHeader });
					console.log(result);
				}				
				catch (err) {
					console.log(err);
				}
				*/
			}
		}
	}
});

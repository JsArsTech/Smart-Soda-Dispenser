const electron = require('electron');
const path = require('path');
const url = require('url');

const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

function createWindow() {

	mainWindow = new BrowserWindow({
		width: 1180,
		height: 800,
		frame: true,
		webPreferences: {
			nodeIntegration: true
		}
	});

	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, 'UI/index.html'),
			protocol: 'file',
			slashes: true
		})
	);

	mainWindow.on('closed', function() {
		mainWindow = null;
	});

	mainWindow.openDevTools();
} 

app.on('ready', createWindow);

app.on('window-all-closed', function() {
	app.quit();
});

app.on('activate', function() {
	if (mainWindow === null) {
		createWindow();
	}
});
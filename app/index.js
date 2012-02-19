var Framework = require("../framework");
var config = require("./config").config;
const APP_PATH = __dirname;
const START_TIME = new Date();

exports.run = function (req, res) {
	this.init();
	console.log("app run at %s", START_TIME);
	console.log("app path : %s", APP_PATH);
	
	framework = new Framework(this);
	//load app config
	//load router config
	framework.run(req, res);
}

exports.init = function() {
	this.appPath = APP_PATH;
	this.appConfig = config;
}
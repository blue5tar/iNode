var Framework = require("../framework");

global.APP_PATH = __dirname;
global.START_TIME = new Date().getTime();

var config = require("./config").config;

global.appConfig = config;

exports.run = function (req, res) {
    this.init();
    console.log("app run at %s", START_TIME);
    console.log("app path : %s", APP_PATH);
    
    var framework = new Framework(this);
    //load app config
    //load router config
    framework.run(req, res);
}

exports.init = function() {
    this.appPath = global.APP_PATH;
    this.appConfig = config;
}
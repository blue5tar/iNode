var Framework = require("../framework");

global.APP_PATH = __dirname;
var config = require("./config").config;

exports.main = function () {
    console.log("app path : %s", APP_PATH);
    
    var app = new Framework().createApp(config);
    //app.setView("ejs");
    //app.setRoute(routeCallBack);
    app.run();
}

function routeCallBack(uri)
{
	var ctr = "index";
	var act = "show";
	return {controller: ctr, action: act};
}
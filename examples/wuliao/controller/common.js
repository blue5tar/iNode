var util = require("util");
var Controller = require("../../../lib/framework/controller");

exports = module.exports = CommonController;

function CommonController(app) {
	Controller.call(this, app);
}

util.inherits(CommonController, Controller);
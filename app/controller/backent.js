var util = require("util");
var CommonController = require("./common");

exports = module.exports = BackentController;

function BackentController (app) {
    CommonController.call(this, app);
}

util.inherits(BackentController, CommonController);
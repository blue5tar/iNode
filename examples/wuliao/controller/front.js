var util = require("util");
var CommonController = require("./common");

exports = module.exports = FrontController;

function FrontController (app) {
    CommonController.call(this, app);
}

util.inherits(FrontController, CommonController);

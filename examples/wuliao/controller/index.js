var util = require("util");
var FrontController = require("./front")
    fs = require("fs");

exports = module.exports = IndexController;

function IndexController (app) {
    FrontController.call(this, app);
}

util.inherits(IndexController, FrontController);

var index = IndexController.prototype;

index.show = function() {
    this.res.renderView('chat', this.view);  
};

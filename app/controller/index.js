var util = require("util");
var FrontController = require("./front");

exports = module.exports = IndexController;

function IndexController () {
	
}

util.inherits(IndexController, FrontController);

index = IndexController.prototype;

index.show = function(req, res) {
	console.log("Index show");
	res.end("Index show");
	//res.end(view.render('index'));
};
var util = require("util");
var FrontController = require("./front");

exports = module.exports = IndexController;

function IndexController () {
	
}

util.inherits(IndexController, FrontController);

index = IndexController.prototype;

index.show = function(req, res) {
	console.log("Index show");
	//res.end("Index show");
	var content = "<link rel=\"stylesheet\" href=\"/style.less\"><div class=\"box\"><img src=\"/images/meinv.jpg\"></div>";
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	res.end(content);
	//res.end(view.render('index'));
};
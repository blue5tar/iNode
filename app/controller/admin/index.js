var util = require("util");
var BackentController = require("../backent");

exports = module.exports = IndexController;

function IndexController () {
    
}

util.inherits(IndexController, BackentController);

var index = IndexController.prototype;

index.show = function(req, res) {
    console.log("admin Index show");
    //res.end("Index show");
    var content = "<link rel=\"stylesheet\" href=\"/style.less\"><div class=\"box\">admin index</div>";
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(content);
    //res.end(view.render('index'));
};
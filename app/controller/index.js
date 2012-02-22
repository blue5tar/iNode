var util = require("util");
var FrontController = require("./front");

exports = module.exports = IndexController;

function IndexController (app) {
    FrontController.call(this, app);
}

util.inherits(IndexController, FrontController);

index = IndexController.prototype;

index.show = function(req, res) {
    console.log("Index show");

    // var content = "<link rel=\"stylesheet\" href=\"/style.less\"><div class=\"box\"><img src=\"/images/meinv.jpg\"></div>";
    
    this.view
        .assign('attr', 'hello')
        .assign('value', 'world')
        .assign('id', '1');
    
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(this.view.render('index'));
    //res.end(view.render('index'));
};

index.post = function(req, res) {
    this.view
        .assign('attr', req.post("username", "string"))
        .assign('value', req.post("hobby", "array").join(","))
        .assign('id', req.get('id', 'int'));

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(this.view.render('index'));
}
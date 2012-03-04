var util = require("util");
var FrontController = require("./front")
    fs = require("fs");

exports = module.exports = IndexController;

function IndexController (app) {
    FrontController.call(this, app);
}

util.inherits(IndexController, FrontController);

var index = IndexController.prototype;

index.show = function(req, res) {
    this.view
        .assign({attr: 'hello', value: 'world'})
        .assign('id', req.cookie.a);

    res.renderView('index', this.view);
};

index.post = function(req, res) {
    res.redirect("/index", true);
    return;
    this.view
        .assign('attr', req.post("username", "string"))
        .assign('value', req.post("hobby", "array").join(","))
        .assign('id', req.get('id', 'int'));

    var files = req.file("files");

    if (files) {
        fs.rename(files.path, global.appConfig.uploadDir + '/' + files.filename);
    }


    res.renderView('index', this.view);
}
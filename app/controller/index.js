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
    if (!this.req.session.test) {
        console.log("----no session data ----");
        this.req.session.test = 111;
    }
    this.view
        .assign({attr: 'hello', value: 'world'})
        .assign('id', this.req.session.test);

    this.res.renderView('index', this.view);
};

index.post = function() {
    this.view
        .assign('attr', this.req.post("username", "string"))
        .assign('value', this.req.post("hobby", "array").join(","))
        .assign('id', this.req.get('id', 'int'));

    var files = this.req.file("files");

    if (files) {
        fs.rename(files.path, $_APP.config.uploadDir + '/' + files.filename);
    }


    this.res.renderView('index', this.view);
}

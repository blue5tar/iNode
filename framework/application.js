var Router = require("./router"),
    View = require("./view"),
    path = require("path");

exports = module.exports = Application;

function Application(config) {
    if (typeof config !== "object" || !config.path) {
        throw new Error("config error");
    }

    this.config = config;
    this.path = config.path;
    this.controllerPath = this.path + '/controller';
    this.viewPath = this.path + '/views';
    this.view = config.view || "ejs";

    this.router = new Router;
};

app = Application.prototype;

app.setRoute = function(callback) {
    this.router.setRouterParser(callback);
}

app.run = function() {
    this.router.route();
    this.controller = this.router.controller;
    this.action = this.router.action;
    console.log("controller:" + this.controller);
    console.log("action:" + this.action);
    dispatch.call(this);
};


function dispatch() {
    var app = this;
    var res = global.$_S.RESPONSE;

    var controllerPath = this.controllerPath + '/' + this.controller + '.js';
    path.exists(controllerPath, function(exists) {
        if (exists) {
            var CtrModule = require(controllerPath);
    
            var controller = new CtrModule();
            if (controller.validate(app.action)) {
                if (controller[app.action]) {
                    var view = new View(app.view);
                    view.setPath(app.viewPath);
                    controller.view = view;
                    controller.req = global.$_S.REQUEST;
                    controller.res = global.$_S.RESPONSE;
                    controller[app.action]();
                } else {
                    res.notFound();
                }
            } else {
                res.forbidden();
            }
        } else {
            res.notFound();
        }
    });
}

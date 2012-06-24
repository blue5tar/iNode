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

/**
 * set a custom router
 *
 * @param function parser 
 *
 * @author blue5tar
 * @return void
 */
app.setRoute = function(parser) {
    this.router.setRouterParser(parser);
}

/**
 * set view engine
 *
 * @param string viewer view engine
 * 
 * @author blue5tar
 * @return void
 */
app.setView = function(viewer) {
    if (typeof viewer !== "undefined" && viewer != "") {
        this.view = viewer;
    }
}

app.set404 = function() {

};
/**
 * run app
 *
 * @author blue5tar
 * @return void
 */
app.run = function() {
    this.router.route();
    this.controller = this.router.controller;
    this.action = this.router.action;
    dispatch.call(this);
};

/**
 * contrl dispatch
 *
 * @author blue5tar
 * @return void
 */
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
                    //set controller view
                    var view = new View(app.view);
                    view.setPath(app.viewPath);
                    controller.view = view;

                    //set controller request & response
                    var requestWrapper = require("./request");
                    var responseWrapper = require("./response");
                    controller.req = new requestWrapper;
                    controller.res = new responseWrapper;
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

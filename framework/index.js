var router = require("./router");
var path = require("path");
//console.log("load index modules");

exports = module.exports = Framework;

function Framework(app) {
    this.app = app;
}

Framework.prototype.run = function(req, res) {
    var self = this;
    this.req = req;
    this.res = res;
    console.log("framework run");

    var route = router.parseUri(req.url);

    self._dispatch(route.controller, route.action);
    
};

Framework.prototype._dispatch = function(controller, action) {
    var self = this;
    console.log("dispatch");
    
    var controllerPath = this.app.appPath + '/controller/' + controller;
    console.log("controller path : %s", controllerPath);

    path.exists(controllerPath + '.js', function(exists) {
        if (exists) {
            var CtrModule = require(controllerPath);
    
            var controller = new CtrModule(self.app);
            if (controller.validate(action)) {
                if (controller[action]) {
                    controller[action](self.req, self.res);
                } else {
                    self.res.notFound();
                }
            } else {
                console.log("validate false");
                self.res.forbidden();
            }
        } else {
            self.res.notFound();
        }
    });
};



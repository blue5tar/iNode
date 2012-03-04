var router = require("./router"),
    path = require("path");

exports = module.exports = Framework;

function Framework(app) {
    this.app = app;
}

Framework.prototype.run = function(req, res) {
    var self = this;
    this.req = req;
    this.res = res;

    var route = router.parseUri(req.url);

    self._dispatch(route.controller, route.action);
    
};

Framework.prototype._dispatch = function(controller, action) {
    var self = this;
    
    var controllerPath = this.app.appPath + '/controller/' + controller;
    //console.log("controller path : %s", controllerPath);

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
                self.res.forbidden();
            }
        } else {
            self.res.notFound();
        }
    });
};



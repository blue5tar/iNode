var router = require("./router");
var path = require("path");
//console.log("load index modules");

require("./response");
require("./request");

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

    req.dataParse(function(){
        self._dispatch(route.controller, route.action);
    });
    
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
                console.log("validate true");
                if (controller[action]) {
                    controller[action](self.req, self.res);
                } else {
                    self.res.writeHead(404, "Page Not Found");
                    self.res.end();
                }
            } else {
                console.log("validate false");
                self.res.writeHead(403, "forbidden");
                self.res.end();
            }
        } else {
            self.res.writeHead(404, "Page Not Found");
            self.res.end();
        }
    });
};



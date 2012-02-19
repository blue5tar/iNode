var router = require("./router");
//console.log("load index modules");

exports = module.exports = Framework;

function Framework(app) {
	this.app = app;
}

Framework.prototype.run = function(req, res) {
	this.req = req;
	this.res = res;
	console.log("framework run");
	
	var res = router.parseUri(req.url);
	this._dispatch(res.controller, res.action);
};

Framework.prototype._dispatch = function(controller, action) {
	console.log("dispatch");
	console.log("controller path : " + this.app.appPath + '/controller/' + controller);
	var CtrModule = require(this.app.appPath + '/controller/' + controller);
	var controller = new CtrModule();
	if (controller.validate(action)) {
		console.log("validate true");
		controller[action](this.req, this.res);
	} else {
		console.log("validate false");
	}
};



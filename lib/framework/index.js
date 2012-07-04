var Application = require("./application"),
    path = require("path");

exports = module.exports = Framework;

function Framework(req, res) {
	this.req = req;
	this.res = res;
}

/**
 * create a app
 *
 * @param object config
 *
 * @author blue5tar
 * @return app single instance
 */
Framework.prototype.createApp = function(config) {
    return new Application(this.req, this.res, config);
};


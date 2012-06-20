var Application = require("./application"),
    path = require("path");

exports = module.exports = Framework;

global.$_APP = null;

function Framework() {

}

Framework.prototype.createApp = function(config) {
    if (global.$_APP === null) {
        global.$_APP = new Application(config);
    }
    return global.$_APP;
};


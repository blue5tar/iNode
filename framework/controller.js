var View = require("./view");

exports = module.exports = Controller;

function Controller(app) {
    this.app = app;
    this.view = new View();
    this.view.setPath(this.app.appPath + '/views');
}

Controller.prototype.validate = function (action) {
    return true;
};
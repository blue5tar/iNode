var View = require("./view");

exports = module.exports = Controller;

function Controller(app) {
    this.app = app;
    console.log(this.app.appConfig.view);
    this.view = new View(this.app.appConfig.view.toLowerCase());
    this.view.setPath(this.app.appPath + '/views');
}

Controller.prototype.validate = function (action) {
    return true;
};
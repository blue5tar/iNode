var ejs = require("ejs");

exports = module.exports = View;

function View(option) {
    this.option = option || {cache: true};
    this.option.locals = {};
    this.templatePath = '';
}
View.prototype.setPath = function(path) {
    this.templatePath = path;
    return this;
};

View.prototype.openCache = function() {
    this.option.cache = true;
    return this;
};

View.prototype.assign = function(attr, value) {
    this.option.locals[attr] = value;
    return this;
};

View.prototype.render = function(template) {
    console.log("render: " + this.templatePath + '/' + template + '.ejs');
    console.log(this.option);
    return ejs.renderFile(this.templatePath + '/' + template + '.ejs', this.option);
};
var ejs = require("ejs");

exports = module.exports = EjsWrapper;

function EjsWrapper() {
    this.option = {
        cache: true,
        locals: {}
    };
}
EjsWrapper.prototype.setCache = function(isCache) {
    this.option.cache = isCache;
    return this;
};

EjsWrapper.prototype.assign = function(attr, value) {
    this.option.locals[attr] = value;
    return this;
};

EjsWrapper.prototype.render = function(filePath) {
    var content = '';
    ejs.renderFile(filePath + '.ejs', this.option, function(err, data) {
        if (err) {
            content = err.toString();
        } else {
            content = data;
        }
    });
    return content;
};
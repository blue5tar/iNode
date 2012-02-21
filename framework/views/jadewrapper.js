var jade = require("jade");

exports = module.exports = JadeWrapper;

function JadeWrapper() {
    this.option = {
        cache: true,
        locals: {}
    };
}
JadeWrapper.prototype.setCache = function(isCache) {
    this.option.cache = isCache;
    return this;
};

JadeWrapper.prototype.assign = function(attr, value) {
    this.option.locals[attr] = value;
    return this;
};

JadeWrapper.prototype.render = function(filePath) {
    var content = '';
    jade.renderFile(filePath + '.jade', this.option, function(err, data) {
        if (err) {
            content = err.toString();
        } else {
            content = data;
        }
            
    });
    return content;
};
var res = require("http").ServerResponse.prototype;

res.render = function(content, contentType) {
    contentType = contentType || "text/html";
    this.writeHead(200, {
        'Content-Type': contentType
    });
    this.end(content);
};

res.renderView = function(template, view) {
    var self = this;
    view.render(template, function(data) {
        self.render(data);
    });
};
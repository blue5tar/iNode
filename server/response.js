var res = require("http").ServerResponse.prototype;
var mimes = require("./mimes").mimes;
var fs = require("fs");
var path = require("path");

res.render = function(content, contentType, binary) {
    var contentType = contentType || "text/html";

    this.writeHead(200, {
        'Content-Type': contentType
    });

    if (binary) {
        this.write(content, 'binary');
    } else {
        this.write(content);
    }
    this.end();
};

res.renderFile = function(file, callback) {
    var self = this;
    path.exists(file, function(exists) {
        if (exists) {
            var extName = path.extname(file).substr(1);
            fs.readFile(file, "binary", function(err, data) {
                if (err) {
                    self.serverError("error!");
                } else {
                    if (callback) {
                        callback(data);
                    } else {
                        var contentType = mimes[extName];
                        if (!contentType) {
                            self.serverError("contentType error");
                            return;
                        }
                        self.render(data, contentType, true);
                    }
                }
            });
        } else {
            self.serverError("File Not Find!");
        }
    });
};

res.renderView = function(template, view) {
    var self = this;
    view.render(template, function(data) {
        self.render(data);
    });
};

res.serverError = function(message) {
    this.writeHead(505, message, {'Content-Type': 'text/plain'});
    this.end(message);
};

res.notFound = function() {
    this.writeHead(404);
    this.end();
};

res.notModify = function() {
    this.writeHead(304);
    this.end();
};

res.forbidden = function() {
    this.writeHead(403);
    this.end();
};
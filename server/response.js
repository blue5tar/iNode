var res = require("http").ServerResponse.prototype,
    mimes = require("./mimes").mimes,
    fs = require("fs"),
    path = require("path");

res.render = function(content, contentType, binary) {
    content = content.toString();
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

res.redirect = function(url, permanently) {
    var statusCode = 302;
    permanently = permanently || false;
    if (permanently) {
        statusCode = 301;
    }

    this.writeHead(statusCode, {
        'Location' : url
    });
    this.end();
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

var writeHead = res.writeHead;
res.writeHead = function(statusCode, reasonPhrase, headers) {
    this.writeHead = writeHead;
    var cookieArray = [];
    for(name in this._cookieArr) {
        cookieArray.push(this._cookieArr[name]);
    }
    if (cookieArray.length > 0) {
        this.setHeader("Set-Cookie", cookieArray);    
    }
    this.writeHead(statusCode, reasonPhrase, headers);
};

// var end = res.end;
// res.end = function(data, encoding) {
//     this.end = end;
    
//     this.end(data, encoding);
// };

res._cookieArr = {};
res.setCookie = function(name, value, options) {
    options = options || {};
    if (value === null) {
        value = '';
        options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
        var date;
        if (typeof options.expires == 'number') {
            date = new Date();
            date.setTime(date.getTime() + (options.expires * 1000));
        } else {
            date = options.expires;
        }
        expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
    }
    var path   = options.path ? '; path=' + options.path : '';
    var domain = options.domain ? '; domain=' + options.domain : '';
    var secure = options.secure ? '; secure' : '';
    var cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    this._cookieArr[name] = cookie;
};
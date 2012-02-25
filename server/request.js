var req = require("http").IncomingMessage.prototype;
var formidable = require("formidable");
var url = require("url");
var querystring = require("querystring");
var util = require("util");

req.__defineGetter__('ip', function() {
    return this.connection.remoteAddress;
});

req.isAjax = function() {

};

req.get = function(name, format) {
    return getParams.call(this, 'get', name, format);
};

req.post = function(name, format) {
    return getParams.call(this, 'post', name, format);
};

req.file = function(name) {
    return this.params['file'] !== null ? (this.params['file'][name] ? this.params['file'][name] : null) : null;
};

function getParams (type, name, format) {
    var value = this.params[type] !== null ? (this.params[type][name] ? this.params[type][name] : null) : null;

    switch(format) {
        case 'array':
            if (typeof(value) != "array") {
                value = [value];
            }
            break;
        case 'int':
            value = Number(value);
            break;
        case 'string':
            value = (value === null ? '' : String(value));
            break;
        case 'bool':
            value = Boolean(value);
            break;
        default:
            break;
    }
    return value;
}

req.dataParse = function(fn) {
    var self = this;
    if (this.params) {
        return;
    }
    this.params = {get: null, post: null, file: null};

    var urlParsed = url.parse(this.url);
    this.params.get = querystring.parse(urlParsed.query);

    if (this.method == "POST") {
        var form = new formidable.IncomingForm();
        this.params.post = {};
        this.params.file = {};

        form.uploadDir = '/tmp';

        form
            .on('error', function(err) {
                console.log(err);
            })
            .on('field', function(field, value) {
                if (form.type == 'multipart') {
                    if (self.params.post[field]) {
                        if (util.isArray(self.params.post[field]) == false) {
                            self.params.post[field] = [self.params.post[field]];
                        }
                        self.params.post[field].push(value);
                        return;
                    }
                }
                self.params.post[field] = value;
            })
            .on('file', function(field, file) {
                if (file.name != '') {
                    self.params.file[field] = file;
                }
            })
            .on('end', function() {
                fn();
            });
        form.parse(this);
    } else {
        fn();
    }
};


var req = require("http").IncomingMessage.prototype;
var formidable = require("formidable");
var url = require("url");
var querystring = require("querystring");
var util = require("util");

req.get = function(name, format) {
    return this.getParams('get', name, format);
};

req.post = function(name, format) {
    return this.getParams('post', name, format);
};

req.getParams = function(type, name, format) {
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
            value = String(value);
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
    this.params = {get: null, post:null};
    
    var urlParsed = url.parse(this.url);
    this.params.get = querystring.parse(urlParsed.query);

    if (this.method == "POST") {
        var form = new formidable.IncomingForm();
        this.params.post = {};

        form
            .on('error', function(err) {
                //
            })
            .on('field', function(field, value) {
                self.params.post[field] = value;
            })
            .on('file', function(field, file) {
                console.log(field, file);
                //files.push([field, file]);
              })
            .on('end', function() {
                fn();
            });
        form.parse(this);
    } else {
        fn();
    }
};


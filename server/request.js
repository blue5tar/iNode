var req = require("http").IncomingMessage.prototype;
var formidable = require("formidable");
var url = require("url");
var querystring = require("querystring");
var util = require("util");

req.__defineGetter__('ip', function() {
    return this.connection.remoteAddress;
});

req.__defineGetter__('referer', function() {
    return this.headers['referer'] || '';
});

req.isAjax = function() {
    return;
};

req.isRobot = function() {
    return;
};

req.__defineGetter__('browser', function() {
    var userAgent = this.headers['user-agent'];

    //@see http://www.cnblogs.com/phphuaibei/archive/2011/12/09/2282570.html
    //@todo 
    return { //移动终端浏览器版本信息 
        trident: userAgent.indexOf('Trident') > -1, //IE内核
        presto: userAgent.indexOf('Presto') > -1,   //opera内核
        webKit: userAgent.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') == -1, //火狐内核
        mobile: !!userAgent.match(/AppleWebKit.*Mobile.*/)||!!userAgent.match(/AppleWebKit/), //是否为移动终端
        ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: userAgent.indexOf('Android') > -1, //android终端或者uc浏览器
        iPhone: userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
        iPad: userAgent.indexOf('iPad') > -1, //是否iPad
    };
});

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
                self.params.file[field] = file;
            })
            .on('end', function() {
                fn();
            });
        form.parse(this);
    } else {
        fn();
    }
};


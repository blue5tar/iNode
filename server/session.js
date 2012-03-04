var md5 = require("./utilities/md5");

exports = module.exports = Session;

function Session(request, options) {
    //this.req = request;
    this.options = options || {storage: 'memory', expires: 24 * 60 * 60};
    var urlGetSid = request.get("NODESESSID", "string");
    if (urlGetSid) {
        this.sessionId = urlGetSid;
    } else {
        if (request.cookie.NODESESSID) {
            this.sessionId = request.cookie.NODESESSID;
        } else {
            this.sessionId = _generateSessionId(request.ip);
        }
    }

    if (this.options.storage) {
        var storage = require("./session/" + this.options.storage);
        this.storage = new storage(this);
    }
}

var session = Session.prototype;

session.get = function (name) {
    return this.storage.get(name);
};

// set("name", "value")
//set({name: value})
session.set = function (name, value) {
    this.storage.set(name, value);
}; 

session.save = function (res) {
    res.setCookie(
        "NODESESSID", 
        this.sessionId, 
        {expires : this.options.expires, path: this.options.path}
    );
};

function _generateSessionId(ipString) {
    return md5(Math.random.toString() + ipString);
}
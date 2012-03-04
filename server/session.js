var md5 = require("./utilities/md5");

exports = module.exports = Session;

function Session(request, options) {
    this.options = options || {storage: 'memory', expires: 60};
    var urlGetSid = request.get("NODESESSID", "string");
    if (urlGetSid) {
        console.log("urlSid");
        this.sessionId = urlGetSid;
    } else {
        if (request.cookie.NODESESSID) {
            console.log("cookie session");
            this.sessionId = request.cookie.NODESESSID;
        } else {
            console.log("generateSession");
            this.sessionId = _generateSessionId();
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

function _generateSessionId() {
    return md5(Math.random.toString());
}
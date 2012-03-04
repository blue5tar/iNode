var md5 = require("./utilities/md5");

exports = module.exports = Session;

var data = {};
function Session(request, options) {
    //this.req = request;
    this.options = options || {expires: 24 * 60 * 60, path: '/'};
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

    if (!data[this.sessionId]) {
        data[this.sessionId] = {};    
    }
}

var session = Session.prototype;

session.get = function (name) {
    return data[this.sessionId][name];
};

// set("name", "value")
//set({name: value})
session.set = function (name, value) {
    data[this.sessionId][name] = value;
}; 

session.save = function (res) {
    res.setCookie(
        "NODESESSID", 
        this.sessionId, 
        {expires : this.options.expires, path: this.options.path}
    );
};

function _generateSessionId(ipString) {
    return md5(Math.random.toString() + ipString + Date.now());
}
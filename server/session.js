var md5 = require("./utilities/md5");

exports = module.exports = Session;

var sessionData = {},
    GC_TIME = 60000, // 1m
    MAX_AGE = 1800000; // 30m

function Session(request, options) {
    //this.req = request;
    this.options = options || {};
    this.options.expires = this.options.expires || MAX_AGE;
    this.options.path = this.options.path || '';

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

    if (this.sessionId in sessionData) { //flush timestamp
        sessionData[this.sessionId].timestamp = new Date().getTime();
    } else { //new session
        sessionData[this.sessionId] = {
            data: {},
            timestamp: new Date().getTime()
        };
    }
}

var session = Session.prototype;

session.get = function (name) {
    return sessionData[this.sessionId].data[name];
};

// set("name", "value")
//set({name: value})
session.set = function (name, value) {
    sessionData[this.sessionId].data[name] = value;
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

//delete expires session
setInterval(function() {
    var timestamp = new Date().getTime();
    for (var sid in sessionData) {
        if (sessionData[sid].timestamp + MAX_AGE < timestamp) {
            delete sessionData[sid];
        }
    }
}, GC_TIME);
var md5 = require("./utilities/md5");

var session = module.exports;

var sessionData = {},
    GC_TIME = 60000, // 1m
    MAX_AGE = 1800000; // 30m

session.start = function (request, response, options) {
    options = options || {};
    options.expires = options.expires || MAX_AGE;
    options.path = options.path || '';

    var sessionId = request.get("NODESESSID", "string");
    if (sessionId == '') {
        if (request.cookie.NODESESSID) {
            sessionId = request.cookie.NODESESSID;
        } else {
            sessionId = _generateSessionId(request.ip);
        }

        response.setCookie(
            "NODESESSID", 
            sessionId, 
            {expires : options.expires, path: options.path}
        );
    }

    if (sessionId in sessionData) { //flush timestamp
        sessionData[sessionId].timestamp = new Date().getTime();
    } else { //new session
        sessionData[sessionId] = {
            data: {},
            timestamp: new Date().getTime()
        };
    }
    request.session = sessionData[sessionId];
}

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
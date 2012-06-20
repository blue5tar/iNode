var http = require("http"),
    Session = require("./session"),
    url = require("url"),
    mimes = require("./mimes").mimes,
    fs = require("fs"),
    path = require("path"),
    less = require("less"),
    util = require("util"),
    serverConfig = require("./config").config;

/** extend request & response**/
require("./response");
require("./request");

/** server global var**/
global.$_S = {};

var server = http.createServer(function(req, res) {
    global.$_S.REQUEST  = req;
    global.$_S.RESPONSE = res;

    var accessUrl = req.url;
    //log
    if (serverConfig.openAccessLog) {
        console.log("access ip: %s, url : %s", req.ip, accessUrl);
    }


    if (checkIsStatics(accessUrl)) {
        processStatics(accessUrl);
        return;
    }

    //other
    var web = require(serverConfig.webPath);
    req.dataParse(function(){
        Session.start();
        web.main();
    });
});

server.listen(serverConfig.port);
    // process.on('uncaughtException', function(err){
//     console.log(err);
// });

console.log("the server run on port %d at %s", server.address().port, new Date());


/**
 * process all static files /img/a.png /css/style.css
 * 
 * @author blue5tar
 */
function checkIsStatics(accessUrl) {
    return /\.(gif|png|jpg|bmp|ico|js|css|txt|less)$/i.test(accessUrl);
}

/**
 * process all static files /img/a.png /css/style.css
 * 
 * @author blue5tar
 */
function processStatics(accessUrl) {
    //process static file
    var res = global.$_S.RESPONSE,
        req = global.$_S.REQUEST;

    //console.log("static file: " + accessUrl);
    var result = url.parse(accessUrl);
    
    // app/public/
    var staticFile = serverConfig.webPath + '/public' + accessUrl;

    // static file cache
    //read static file
    //@see http://club.cnodejs.org/topic/4f16442ccae1f4aa27001071
    //@todo Etag
    path.exists(staticFile, function(exists) {
        if (exists) {
            fs.stat(staticFile, function (err, stat) {
                var lastModified = stat.mtime.toUTCString(); //file lastModify
                var ifModifiedSince = "If-Modified-Since".toLowerCase();
                res.setHeader("Last-Modified", lastModified);

                var expires = new Date();
                expires.setTime(expires.getTime() + serverConfig.staticFileExpires * 1000);
                res.setHeader("Expires", expires.toUTCString());
                res.setHeader("Cache-Control", "max-age=" + serverConfig.staticFileExpires);

                if (req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
                    res.notModify();
                } else {
                    var extName = path.extname(staticFile).substr(1);
                    var callback = null;
                    if (extName == 'less') { //@see http://www.lesscss.net/
                        callback = function(data) {
                            less.render(data, function(e, css) {
                                res.render(css, mimes['css'], true);
                            });
                        };
                    }
                    res.renderFile(staticFile,callback); 
                }
            });
        } else {
            res.notFound();
        }
    });
    return;
}

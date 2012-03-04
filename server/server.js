var http = require("http"),
    Session = require("./session"),
    url = require("url"),
    mimes = require("./mimes").mimes,
    fs = require("fs"),
    path = require("path"),
    less = require("less"),
    util = require("util");

global.serverConfig = require("./config").config;

require("./response");
require("./request");

var server = http.createServer(function(req, res) {
    var accessUrl = req.url;
    //log
    if (global.serverConfig.openAccessLog) {
        console.log("access ip: %s, url : %s", req.ip, accessUrl);
    }

    //process static file
    if (/\.(gif|png|jpg|bmp|ico|js|css|txt|less)$/i.test(accessUrl)) {
        //console.log("static file: " + accessUrl);
        var result = url.parse(accessUrl);
        
        // app/public/
        var staticFile = global.serverConfig.webPath + '/public' + accessUrl;

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
                    expires.setTime(expires.getTime() + global.serverConfig.staticFileExpires * 1000);
                    res.setHeader("Expires", expires.toUTCString());
                    res.setHeader("Cache-Control", "max-age=" + global.serverConfig.staticFileExpires);

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

    //other
    var webSite = require(global.serverConfig.webPath);
    req.dataParse(function(){
        Session.start(req, res);
        webSite.run(req, res);
    });
});

server.listen(global.serverConfig.port);

// process.on('uncaughtException', function(err){
//     console.log(err);
// });

console.log("the server run on port %d at %s", server.address().port, new Date());
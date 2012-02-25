var http = require("http");
var url = require("url");
var config = require("./config").config;
//var BufferHelper = require("bufferHelper");
var mimes = require("./mimes").mimes;
var fs = require("fs");
var path = require("path");
var less = require("less");
//var EventProxy = require("eventproxy");

require("./response");
require("./request");

var server = http.createServer(function(req, res) {
    var accessUrl = req.url;
    //log
    if (config.openAccessLog) {
        console.log("access ip: %s, url : %s", req.ip, accessUrl);
    }

    //process static file
    if (/\.(gif|png|jpg|bmp|ico|js|css|txt|less)$/i.test(accessUrl)) {
        console.log("static file: " + accessUrl);
        var result = url.parse(accessUrl);
        
        // app/public/
        var staticFile = config.webPath + '/public' + accessUrl;

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
                    expires.setTime(expires.getTime() + config.staticFileExpires * 1000);
                    res.setHeader("Expires", expires.toUTCString());
                    res.setHeader("Cache-Control", "max-age=" + config.staticFileExpires);

                    if (req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
                        res.notModify();
                    } else {
                        var extName = path.extname(staticFile).substr(1);
                        res.renderFile(staticFile, function(data, output) {
                            if (extName == 'less') { //@see http://www.lesscss.net/
                                less.render(data, function(e, css) {
                                    res.render(css, mimes['css'], true);
                                });
                            }
                        }); 
                    }
                });
            } else {
                res.notFound();
            }
        });
        return;
    }

    //other
    var webSite = require(config.webPath);
    req.dataParse(function(){
        webSite.run(req, res);
    });
});

server.listen(config.port);

console.log("the server run on port %d at %s", server.address().port, new Date());
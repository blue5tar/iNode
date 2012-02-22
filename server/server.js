var http = require("http");
var url = require("url");
var config = require("./config").config;
//var BufferHelper = require("bufferHelper");
var mimes = require("./mimes").mimes;
var fs = require("fs");
var path = require("path");
var less = require("less");
//var EventProxy = require("eventproxy");


var server = http.createServer(function(req, res) {
    var accessUrl = req.url;
    //log
    if (config.openAccessLog) {
        console.log("access ip: %s, url : %s", req.connection.remoteAddress, accessUrl);
    }

    //process static file
    if (/\.(gif|png|jpg|bmp|ico|js|css|txt|less)$/i.test(accessUrl)) {
        console.log("static file: " + accessUrl);
        var result = url.parse(accessUrl);
        var extName = path.extname(result.pathname).substr(1);
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
                        res.writeHead(304, "Not Modified");
                        res.end();
                    } else {
                        fs.readFile(staticFile, "binary", function(err, data) {
                            if (err) {
                                res.writeHead(505, "Internal Server Error", {'Content-Type': 'text/plain'});
                                res.end(err);
                            } else {
                                var outputFile = function(res, extName, data) {
                                    var contentType = mimes[extName];
                                    if (!contentType) {
                                        console.log("not found contentType");//@todo
                                        res.writeHead(505, "unKnown contentType");
                                        res.end();
                                        return;
                                    }
                                    res.writeHead(200, {
                                        'Content-Type': contentType
                                    });
                                    res.write(data, 'binary');
                                    res.end();
                                }

                                if (extName == 'less') { //@see http://www.lesscss.net/
                                    less.render(data, function(e, css) {
                                        outputFile(res, 'css', css);
                                    });
                                } else {
                                    outputFile(res, extName, data);
                                }
                            }

                        });
                    }
                });
            } else {
                res.writeHead(404, 'Not Found');
                res.end();
            }
        });
        return;
    }

    //other
    var webSite = require(config.webPath);
    webSite.run(req, res);
});

server.listen(config.port);

console.log("the server run on port %d at %s", server.address().port, new Date());
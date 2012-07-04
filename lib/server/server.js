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

global.APP_PATH = serverConfig.appPath;

/**
 * create http server
 */
var server = http.createServer(function(req, res) {
    //log
    if (serverConfig.openAccessLog) {
        console.log("access ip: %s, url : %s", req.ip, req.url);
    }

    // if is a static file 
    if (checkIsStatics(req.url)) {
        processStatics(req, res);
        return;
    }

    //dynamic page
    var app = require(global.APP_PATH);
    req.dataParse(function(){
        Session.start(req, res);
        app.main(req, res);
    });
});

server.listen(serverConfig.port);

if (!serverConfig.socketIO) {
    var io = require("socket.io").listen(server, {log: false});
    var ws = require(serverConfig.appPath + '/ws.js');
    io.sockets.on("connection", function(socket) {
        ws.main(socket, io);
    });
}
// process.on('uncaughtException', function(err){
//     console.log(err);
// });

console.log("the server run on port %d at %s", server.address().port, new Date());


/**
 * process all static files /img/a.png /css/style.css
 * 
 * @param string accessUrl 
 *
 * @author blue5tar
 * @return bool
 */
function checkIsStatics(accessUrl) {
    return /\.(gif|png|jpg|bmp|ico|js|css|txt|less)$/i.test(accessUrl);
}

/**
 * process all static files /img/a.png /css/style.css
 *
 * @param string accessUrl 
 *
 * @author blue5tar
 * @return void
 */
function processStatics(req, res) {
    //process static file
    var accessUrl = req.url;
    //console.log("static file: " + accessUrl);
    var result = url.parse(accessUrl);
    
    // app/public/
    var staticFile = serverConfig.appPath + '/public' + accessUrl;

    // static file cache
    //read static file
    //@see http://club.cnodejs.org/topic/4f16442ccae1f4aa27001071
    //@todo Etag
    fs.exists(staticFile, function(exists) {
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
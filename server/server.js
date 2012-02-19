var http = require("http");
var config = require("./config").config;

var server = http.createServer(function(req, res) {
	//log
	if (config.openAccessLog) {
		console.log(req.connection.remoteAddress);
	}

	var webSite = require(config.webPath);
	webSite.run(req, res);
});

server.listen(config.port);

console.log("the server run on port %d at %s", server.address().port, new Date());
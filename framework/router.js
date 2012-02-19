var url = require("url");
var path = require("path");

exports.parseUri = function (reqUrl) {
	console.log("access url is : " + reqUrl);
	console.log("parseUri");
	//default route ruler
	var parsedResult = url.parse(reqUrl);
	console.log(parsedResult);
	var pathname = path.normalize(parsedResult.pathname);
	console.log(pathname);
	if (pathname == '/') {
		controller = 'index';
		action = 'show';
	} else {
		pathnames = pathname.split('/').filter(function(item) { 
			return item != '';
		});
		action = pathnames.pop();
		controller = pathnames.join("/");
	}
	return {
		controller: controller, 
		action: action
	};
};
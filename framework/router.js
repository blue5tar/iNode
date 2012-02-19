var url = require("url");

exports.parseUri = function (reqUrl) {
	console.log("access url is : " + reqUrl);
	console.log("parseUri");
	//default route ruler
	var parsedResult = url.parse(reqUrl);
	//console.log(parsedResult);
	return {
		controller: 'index', 
		action: 'show'
	};
};
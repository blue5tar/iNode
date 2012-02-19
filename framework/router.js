var url = require("url");
var path = require("path");

exports.parseUri = function (reqUrl) {
    console.log("parseUri");
    console.log("access url is : " + reqUrl);
    
    //default route ruler
    var parsedResult = url.parse(reqUrl);
    var pathname = path.normalize(parsedResult.pathname);
    if (pathname == '/') {
        controller = 'index';
        action = 'show';
    } else {
        pathnames = pathname.split('/');
        pathnames.shift(); //remve first empty element
        action = pathnames.pop();
        if (action == '') { // /index/?a=1 action is empty set default show
            action = 'show';
        }
        controller = pathnames.join("/");
    }
    return {
        controller: controller, 
        action: action
    };
};
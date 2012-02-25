var url = require("url");
var path = require("path");

exports.parseUri = function (reqUrl) {
    
    //default route ruler
    var parsedResult = url.parse(reqUrl);
    var pathname = path.normalize(parsedResult.pathname);

    if (pathname == '/') {
        controller = 'index';
        action = 'show';
    } else {
        pathnames = pathname.split('/');
        pathnames.shift(); //remove first empty element
        if (pathnames.length == 1) {
            controller = pathnames[0];
            action = 'show';
        } else {
            action = pathnames.pop();
        }
        
        if (action == '') { // /index/?a=1 action is empty set default show
            action = 'show';
        }
        controller = pathnames.join("/");
    }
    return {
        controller: controller.toLowerCase(), 
        action: action.toLowerCase()
    };
};

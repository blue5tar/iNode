var url = require("url");
var path = require("path");

exports = module.exports = Router;

function Router (req) {
    this.controller = "index";
    this.action     = "show";
    this.routerParser = defaultRouterParser;
    this.req = req;
}

router = Router.prototype;    

router.setRouterParser = function(routerParser) {
    if (typeof routerParser === "function") {
        this.routerParser = routerParser;
    }
};

router.route = function () {
    var uri = this.req.url;

    if (typeof this.routerParser === "function") {
        var route = this.routerParser(uri);
    } else {
        var route = router.parseUri(uri);
    }

    if (typeof route == 'object' && route.controller) {
        this.controller = route.controller;
        if (route.action) {
            this.action = route.action;
        }
    }
}

function defaultRouterParser (uri) {
    
    //default route ruler
    var parsedResult = url.parse(uri);
    var pathname = path.normalize(parsedResult.pathname);

    var controller = "index";
    var action = "show";

    if (pathname != '/') {
        pathnames = pathname.split('/');
        pathnames.shift(); //remove first empty element
        if (pathnames.length == 1) {
            controller = pathnames[0];
        } else {
            action = pathnames.pop();
        }
        
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

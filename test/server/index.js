var should = require("should");

var server = require("../../lib/server/server.js").server;

describe('server', function() {
	it("server should be a object", function(done) {
		server.should.be.a("object");
	});	
});
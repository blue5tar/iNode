var models = require('./models');
var users = models.User;
var Encoder = require('node-html-encoder').Encoder;

exports.main = function(socket, io) {
	socket.on("command", function(cmd) {
		switch(cmd) {
			case "join":
				var user = new users();
				user.sid = socket.id;
				user.chating = false;
				user.to = "";
				user.save(function(err) {
					if (err) {
						console.log(err);
						return;
					}
					console.log("user save");
					socket.emit("command", "joined");
				});
				break;
			case "find stranger":
				console.log("find stranger \n");
				users.findOne({sid: socket.id}, function(err, user) {
					if (user === null) {
						//no user
						return;
					}

					//find stranger
					users.findOne({chating: false, sid: {$ne: socket.id}}, function(err, newStranger) {
						if (err) {
							console.log(err);
							return;
						}
						
						if(user.chating && user.to != "") { //talking with it  remove talk
							users.findOne({sid: user.to}, function(err, stranger) {
								if (stranger === null) {
									return;
								}
								stranger.chating = false;
								stranger.to = "";
								stranger.save(function(err) {
									if (io.sockets.sockets[stranger.sid]) {
										io.sockets.sockets[stranger.sid].emit("command", "stranger leave");
									}
								});
							});
						}

						if (newStranger === null) {
							socket.emit("command", "no stranger");
							if (user.chating) {
								user.chating = false;
								user.to = "";
								user.save();
							}
							return;
						}

						//socket.emit("command", "stranger join");
						var strangerSocket = io.sockets.sockets[newStranger.sid];
						if (strangerSocket) {
							newStranger.chating = true;
							newStranger.to = socket.id;
							newStranger.save(function(err) {
								if (err) return;
								user.chating = true;
								user.to = newStranger.sid;
								user.save(function(err) {
									if (err) return;
									strangerSocket.emit("stranger join", user);
									socket.emit("stranger join", newStranger);
								});
							});
						} else {
							newStranger.remove();
						}
					});
				});
				break;
			default:
				console.log(cmd + " command not found!");
				break;
		}
	});
	
	socket.on("talk", function(message) {
		users.findOne({sid: socket.id}, function(err, user) {
			if (user === null) {
				return;
			}
			if (io.sockets.sockets[user.to]) {
				var encoder = new Encoder('entity');
				message = encoder.htmlEncode(message);
				io.sockets.sockets[user.to].emit("talk", message);
			}
		});
		
	});

	socket.on("disconnect", function() {
		console.log("disconnect \n");
		users.findOne({sid: socket.id}, function(err, user) {
			if (err) {
				console.log(err);
				return;
			}
			if (user === null) return;
			user.remove();
			var talkToSocket = io.sockets.sockets[user.to];
			if (talkToSocket) {
				users.findOne({sid: user.to}, function(err, user) {
					user.chating = false;
					user.to = "";
					user.save(function(err) {
						if (err) return;
						talkToSocket.emit("command", "stranger leave");
					});
				});
			}
		});
	});
};
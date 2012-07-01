var mongoose = require('mongoose');
var config = {db: "mongodb://127.0.0.1/inode"};
  
mongoose.connect(config.db, function (err) {
	if (err) {
		console.error('connect to %s error: ', config.mongoDBName, err.message);
		process.exit(1);
	}
});

require('./user');
exports.User = mongoose.model('User');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	sid: { type: String, unique: true },
	chating: { type: Boolean, default: false },
	to: { type: String}
});

mongoose.model('User', UserSchema);
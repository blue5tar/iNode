exports = module.exports = Memory;

var data = {};
function Memory(session) {
    this.session = session;
    if (!data[this.session.sessionId]) {
        data[this.session.sessionId] = {};    
    }
}

var memory = Memory.prototype;

memory.get = function (name) {
    return data[this.session.sessionId][name];
};

memory.set = function (name, value) {
    data[this.session.sessionId][name] = value;
}
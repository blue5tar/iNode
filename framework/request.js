exports = module.exports = RequestWrapper;

function RequestWrapper() {
    var req = global.$_S.REQUEST;
    
    return req;
}

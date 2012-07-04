 function test() {
   //  this.req = 2; 
     console.log(req);
 } 
function c(cb) {
    cb();
}

c(function() {
    this.req = 3;
    test.call(this);
});

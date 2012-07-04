var assert = require("assert"),
    should = require("should");

describe('Array', function(){
  beforeEach(function(done) {
    console.log("aaa");
    done();
  });

  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
    })

    it('should be ok', function() {

    });
  })
})
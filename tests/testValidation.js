var expect = require('expect');

var {isRealString} = require('../utils/validation');

describe('isRealString', function() {
    
    it('should reject non-string values', function() {
        var res = isRealString(98);
        expect(res).toBe(false);
    });
    
    it('should reject string with only spaces', function() {
        var res = isRealString('      ');
        expect(res).toBe(false);
    });
    
    it('should allow string with non-space characters', function() {
        var res = isRealString('  Wael  ');
        expect(res).toBe(true);
    });
});
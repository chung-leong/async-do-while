var Promise = require('bluebird');
var Chai = require('chai'), expect = Chai.expect;
var Async = require('../index');

describe('Async loop', function() {
    it ('should execute a do-while loop', function() {
        var loop = 0;
        Async.do(() => {
            return Promise.delay(25).then(() => {
                loop++;
            });
        });
        Async.while(() => { return (loop < 10) });
        return Async.end().then(() => {
            expect(loop).to.equal(10);
        });
    })
    it ('should execute a while loop', function() {
        var loop = 0;
        Async.while(() => { return (loop < 10) });
        Async.do(() => {
            return Promise.delay(25).then(() => {
                loop++;
            });
        });
        return Async.end().then(() => {
            expect(loop).to.equal(10);
        });
    })
    it ('should execute a do-while loop once', function() {
        var loop = 0;
        Async.do(() => {
            return Promise.delay(25).then(() => {
                loop++;
            });
        });
        Async.while(() => { return false });
        return Async.end().then(() => {
            expect(loop).to.equal(1);
        });
    })
    it ('should execute a while loop zero times', function() {
        var loop = 0;
        Async.while(() => { return false });
        Async.do(() => {
            return Promise.delay(25).then(() => {
                loop++;
            });
        });
        return Async.end().then(() => {
            expect(loop).to.equal(0);
        });
    })
    it ('should break out of a do-while loop', function() {
        var loop = 0;
        Async.do(() => {
            return Promise.delay(25).then(() => {
                if (loop === 5) {
                    Async.break();
                }
                loop++;
            });
        });
        Async.while(() => { return (loop < 10) });
        return Async.end().then(() => {
            expect(loop).to.equal(5);
        });
    })
})

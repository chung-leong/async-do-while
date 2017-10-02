var Promise = require('bluebird');

var beginFunc = null;
var doFunc = null;
var whileFunc = null;
var returnFunc = null;
var construct = '';

exports.begin = function(f) {
	if (doFunc || whileFunc) {
		throw new Error('Cannot call begin() after while() or do()');
	}
	if (!(f instanceof Function)) {
		throw new Error('Argument must be a function');
	}
	beginFunc = f;
}

exports.while = function(f) {
	if (whileFunc) {
		throw new Error('Cannot call while() consecutively');
	}
	if (!(f instanceof Function)) {
		throw new Error('Argument must be a function');
	}
	if (doFunc) {
		construct = 'do-while';
	}
	whileFunc = f;
}

exports.do = function(f) {
	if (doFunc) {
		throw new Error('Cannot call do() consecutively');
	}
	if (!(f instanceof Function)) {
		throw new Error('Argument must be a function');
	}
	if (whileFunc) {
		construct = 'while-do';
	}
	doFunc = f;
}

exports.return = function(f) {
	if (!doFunc || !whileFunc) {
		throw new Error('Cannot call return() without calling while() and do() beforehand');
	}
	if (!(f instanceof Function)) {
		throw new Error('Argument must be a function');
	}
	returnFunc = f;
}

exports.end = function() {
	if (!doFunc || !whileFunc) {
		throw new Error('Cannot call end() without calling while() and do() beforehand');
	}
	var loopFunc;
	if (construct === 'while-do') {
		loopFunc = function() {
			// first call whileFunc
			var _this = this;
			return Promise.resolve(_this.while()).then(function(result) {
				// if it returns true...
				if (result) {
					// call doFunc
					return Promise.resolve(_this.do()).then(function() {
						// then run the loop again
						return _this.loop();
					});
				}
			});
		};
	} else if (construct === 'do-while') {
		loopFunc = function() {
			// first call do()
			var _this = this;
			return Promise.resolve(_this.do()).then(function() {
				// then call while()
				return Promise.resolve(_this.while()).then(function(result) {
					// if it returns true...
					if (result) {
						// run loop() again
						return _this.loop();
					}
				});
			});
		};
	}
	var context = {
		begin: beginFunc || nop,
		do: doFunc,
		while: whileFunc,
		return: returnFunc || nop,
		loop: loopFunc
	};
	beginFunc = null;
	doFunc = null;
	whileFunc = null;
	returnFunc = null;
	construct = '';
	return run.call(context);
}

var AsyncBreak = new Error;

exports.break = function() {
	throw AsyncBreak;
}

function run() {
	var _this = this;
	return Promise.resolve().then(function() {
		return _this.begin();
	}).then(function() {
		return _this.loop();
	}).catch(function(err) {
		if (err !== AsyncBreak) {
			throw err;
		}
	}).then(function() {
		return _this.return();
	});
}

function nop() {};

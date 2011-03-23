(function () {
    var log = require("util").log,
        debug = require("util").debug;
    
    var defaults = {
        interval: 100, // ms
        quadratic: true,
        attempts: 4,
        RetryGaveUp: function () {
            this.message = "retry has given up";
            this.toString = function () {
                return "RetryGaveUp";
            };
        }
    };
    
    var populate = function (opts) {
        if (opts === undefined) {
            return defaults;
        }
        
        var retval = opts;
        if (opts.interval === undefined) {
            retval.interval = defaults.interval;
        }
        
        if (opts.quadratic === undefined) {
            retval.quadratic = defaults.quadratic;
        }
        
        if (opts.attempts === undefined) {
            retval.attempts = defaults.attempts;
        }
        
        if (opts.RetryGaveUp === undefined) {
            retval.RetryGaveUp = defaults.RetryGaveUp();
        }
        
        return retval;
    };
    
    var RetryError = function (message, code) {
        this.message = message;
        this.code = code;
        return this;
    };

    RetryError.prototype.toString = function () {
        return "RetryError";
    };
    
    RetryError.prototype.tacos = function () {
        return this.message;
    };
    
    var retry = function (func, options) {
        var opts = populate(options);
        
        var retrier = function () {
            try {
                func();
                
            } catch (e) {
                if (e.toString() === "RetryError") {
                    debug("caught a RetryError; might try again.");
                    if (opts.attempts > 0) {
                        debug("will retry again in " + opts.interval + "ms");
                        setTimeout(retrier, opts.interval);
                    } else {
                        debug("won't try again; will throw exception");
                        throw new opts.RetryGaveUp();
                    }
                    opts.attempts--;
                    if (opts.quadratic === true) {
                        opts.interval *= 2;
                    }
                } else {
                    throw e;
                }
            }
        };
        retrier();
    };
    
    
    exports.retry = retry;
    exports.RetryError = RetryError;
    
})();
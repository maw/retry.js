(function () {
    
    var Retry;
    var log, debug, inspect;
    if (typeof exports !== 'undefined') {
        Retry = exports;
        log = require("util").log;
        debug = require("util").debug;
        inspect = require("util").inspect;
    } else {
        this.Retry = Retry = {};
        log = inspect = function () {};
        debug = function (str) {
            $("#debug2").append("<br />" + str);
        };
    }
    
    debug("...");
    
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
    
    var RetryGaveUp = function () {
        this.message = "retry has given up";
        this.toString = function () {
            return "RetryGaveUp";
        };
        return this;
    };
    
    var do_nothing = function () { };
    
    var defaults = {
        interval: 10, // ms
        quadratic: true,
        attempts: 4,
        success: do_nothing,
        gave_up: do_nothing
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
        
        if (opts.success === undefined) {
            retval.success = do_nothing;
        }
        
        if (opts.gave_up === undefined) {
            retval.gave_up = do_nothing;
        }
        
        return retval;
    };
    
    // var Retryer = function (func, options) {
    var Retryer = function (options) {
        var self = this;
        self.func = null;
        self.opts = populate(options);
        
        log(inspect(self.opts));
        
        self.go = function (func) {
            self.func = func;
            self.func();
        };
        
        self.retry = function () {
            if (self.opts.attempts > 0) {
                debug("will retry again in " + self.opts.interval + "ms");
                setTimeout(self.func, self.opts.interval);
                self.opts.attempts--;
                if (self.opts.quadratic === true) {
                    self.opts.interval *= 2;
                }
            } else {
                self.opts.gave_up();
            }
        };
        
        // self.func();
        
        return self;
    };
    
    Retry.Retryer = Retryer;
    Retry.RetryError = RetryError;
    Retry.RetryGaveUp = RetryGaveUp;    
})();

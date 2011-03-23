(function () {
    
    var Retry;
    var log, debug, inspect;
    var do_nothing = function () { };
    
    if (typeof exports !== 'undefined') {
        Retry = exports;
        log = debug = inspect = do_nothing;
        /* log = require("util").log;
           debug = require("util").debug;
           inspect = require("util").inspect; */
    } else {
        this.Retry = Retry = {};
        log = inspect = debug = do_nothing;
        /* debug = function (str) {
           $("#debug2").append("<br />" + str);
           }; */
    } 
    
    debug("...");
    
    var defaults = {
        interval: 100, // ms
        quadratic: true,
        attempts: 4,
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
        
        if (opts.gave_up === undefined) {
            retval.gave_up = do_nothing;
        }
        
        return retval;
    };
    
    var Retryer = function (options) {
        var self = this;
        self.func = null;
        self.opts = populate(options);
        
        self.go = function (func) {
            self.opts.interval = defaults.interval;
            self.func = func;
            self.func();
        };
        
        self.retry = function () {
            if (self.opts.attempts > 0) {
                debug("will retry again in " + self.opts.interval + "ms");
                if (self.opts.quadratic === true) {
                    self.opts.interval *= 2;
                }
                setTimeout(self.func, (self.opts.interval / 2));
                self.opts.attempts--;
                
            } else {
                self.opts.gave_up();
            }
        };
        
        return self;
    };
    
    Retry.Retryer = Retryer;
})();

var log = require("util").log,
    debug = require("util").debug;

var retry = require("./retry");

var gave_up1 = function () {
    debug("gave up");
};

debug("starting tests");
var retryer1 = new retry.Retryer({gave_up: gave_up1, interval: 500});
var will_fail1 = function () {
    debug("will_fail: this will always fail");
    // throw new retry.RetryError("We expect this to fail.");
    retryer1.retry();
};
//retryer1.go(will_fail1);



var retryer,
    gave_up = function () {
        var debug = require("util").debug;
        debug("I'm giving up!");
    },
    count = 0,
    will_fail_intermittently = function () {
        if (count++ < 7) {
            debug("I'm failing on purpose!");
            retryer.retry();
        } else {
            debug("I've decided not to fail this time.  (And so we're done.)");
        }
    };

retryer = new retry.Retryer({gave_up: gave_up, interval: 10, attempts: 10});
retryer.go(will_fail_intermittently);

var retry = window.Retry;

var debug = function (str) {
    $("#debug").append("<br />" + str);
};

/*
var will_fail = function (cb) {
    debug("will_fail: this will always fail");
    throw new retry.RetryError("We expect this to fail.");
    cb();
};

var success = function () {
    debug("success");
};

var error = function () {
    debug("got an error, caller-side");
};
*/
var gave_up = function () {
    debug("gave up");
};
/*
debug("starting tests");
debug("starting basic test");
retry.retry(will_fail, {success: success, error: error, gave_up: gave_up});
*/

var retryer;
var will_fail1;


// retryer = new retry.Retryer(will_fail1, {gave_up: gave_up});
will_fail1 = function () {
    debug("will_fail1: this will always fail");
    // this.retry();
    retryer.retry();
};
retryer = new retry.Retryer({gave_up: gave_up});

retryer.go(will_fail1);

var retryer2,
    gave_up2 = function () {
        debug("ajax giving up");
    };
var ajax_will_fail = function () {
    $.ajax({url: "/doesnotexist",
            success: function (data, status) {
                // just fake failure
                retryer2.retry();
            },
            error: function (a, b, c) {
                throw new retry.RetryError("expected ajax failure");
            }});
};
retryer2 = new retry.Retryer({gave_up: gave_up2, interval: 200});
retryer2.go(ajax_will_fail);



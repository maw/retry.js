retry.js - (relatively) easy to use retrying with quadratic backoff

Note:
====

This code predates and therefore doesn't take into account many
useful advances made in Javascript in the past several years.

It might be interesting to adapt but, honestly, I'd probably give it
a miss if I were you.

Whys and hows:
=============

Maybe you're querying your database from node, or perhaps you're trying to
make an ajax call from the browser.  You encapsulate this into a function,
because you expect to make your query or call more than once.

So, you have a function you'll wish to retry:

    var count = 0;
    var will_fail_intermittently = function () {
        if (count++ < 7) {
            log("I am failing (on purpose)!");
        } else {
            log("I've decided not to fail this time.");
        }
    };

And you'd like to bail out after some reasonable number of attempts have
been made:

    var count = 0;
    var will_fail_intermittently = function () {
        if (count++ < 11) {
            log("I am failing (on purpose)!");
        } else if (count === 8) {
            log("I'm giving up!");
        } else {
            /* We won't ever get here.  */
            log("I've decided not to fail this time.");
        }
    };

What follows is the above rewritten to use retry.js.  This example assumes
node, but retry.js works equally well on the browser.

    var retry = require("./retry"),
        retryer,
        gave_up = function () {
            var debug = require("util").debug;
            debug("I'm giving up!");
        },
        count = 0,
        will_fail_intermittently = function () {
            var debug = require("util").debug;
            if (count++ < 7) {
                debug("I'm failing (on purpose)!");
                retryer.retry();
            } else {
                debug("I've decided not to fail this time.");
            }
        };
    retryer = new retry.Retryer({gave_up: gave_up, attempts: 10});
    retryer.go(will_fail_intermittently);

And there you go.  This interface isn't ideal, to be sure (patches or
suggestions for improvement are, of course, welcome), but it works, and it
beats having to rewrite retrying logic with quadratic backoff over and over.

The Retryer constructor takes a single options argument, with the following
defaults.

    var defaults = {
        interval: 100, // This is in milliseconds.
        quadratic: true, // Double the interval after each failed attempt.
        attempts: 4, // Only try four times.
        give_up: do_nothing // Can you guess what it does?
    };

I think these defaults are reasonable.  If not, they're easy enough to
override.  In many cases, you'll only need to provide your own ``give_up``.


Problems:
========

* You need to create a new Retryer instance for each function you wish to
  watch, although only when they're executing concurrently.  Once a function
  is done, it is safe to reuse a Retryer instance.

* The interface is ugly.  If it were possible, using exceptions would make for
  a much cleaner API.  I don't think it is possible, though.

/**
 * Created by user1017 on 2017/7/29.
 */
"use strict";
const events = require("events");
const common = require('./common');
const hour = 3600000;
const minute = 60000;
const second = 1000;
const STATE = {
    INIT: 0,
    COUNT: 1,
    PAUSE: 2,
    OVER: 3
};


class timer extends events {
    constructor(countdown, interval = second) {
        super();
        this.state = STATE.INIT;
        this.initcountdown = common.tonumber(countdown);
        this.interval = common.tonumber(interval) || second;
        this.countdown = this.initcountdown;
        this.elapsed = 0;
        this.timer = null;
    }


    start() {
        if (this.state != STATE.INIT)
            return;
        this.timer = setInterval(()=> {
            this._tick();
        }, this.interval);
        this.state = STATE.COUNT;
        this.emit('start', this.elapsed, this.countdown);
        if (this.countdown < 0)
            this.stop();
        else
            this.emit('tick', this.elapsed, this.countdown);
    }

    _tick() {
        if (this.state == STATE.COUNT) {
            this.countdown--;
            this.elapsed++;
            this.emit('tick', this.elapsed, this.countdown);
            if (this.countdown <= 0)
                this.stop();
        }
    }

    stop() {
        if (this.state === STATE.OVER)
            return;
        this.state = STATE.OVER;
        this.emit('stop', this.elapsed, this.countdown);
        clearInterval(this.timer);
        this.timer = null;
        this.removeAllListeners();
    }

    pause() {
        if (this.state != STATE.COUNT)
            return;
        clearInterval(this.timer);
        this.timer = null;
        this.state = STATE.PAUSE;
    }

    resume() {
        if (this.state != STATE.PAUSE)
            return;
        this.timer = setInterval(()=> {
            this._tick();
        }, this.interval);
        this.state = STATE.COUNT;
    }

    cancel() {
        this.state = STATE.OVER;
        clearInterval(this.timer);
        this.timer = null;
        this.removeAllListeners();
    }
}

module.exports = timer;



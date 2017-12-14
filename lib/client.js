/**
 * Created by PC1011 on 2017/9/27.
 */
"use strict";
const events = require("events");
const wsrequest = require("./wsrequest");
const common = require("../utils/common");

class client extends events {
    constructor(id, socket, module) {
        super();
        this.socket = socket;
        this.module = module || {};
        this.id = id;
        this.session = {};
        this.requesting = false;
        this.sending = false;
        this.requestqueue = [];
        this.sendqueue = [];
        this.closed = false;
        this.eventrules = new Map();
        this.reqevents = new Map();
        const rules = this.module.eventrules || {};
        for (let e in rules) {
            this.eventrules.set(e, common.tonumber(rules[e]))
        }

        this.heartbeat = {
            timer: null,
            timeout: 1000,
            start: () => {
                this.heartbeat.timer = setTimeout(() => {
                    this.ping();
                    clearTimeout(this.heartbeat.timer);
                    this.heartbeat.start();
                }, this.heartbeat.timeout)
            },
            reset: () => {
                clearTimeout(this.heartbeat.timer);
                this.heartbeat.start();
            },
            stop: () => {
                clearTimeout(this.heartbeat.timer);
            }
        };
        this._initsocket();
    }


    _initsocket() {
        const me = this;
        me.socket.removeAllListeners();

        me.socket.on("error", () => {
            me.close();
        });

        me.socket.on("close", () => {
            me.close();
        });

        me.socket.on("message", (data) => {
            if (typeof data !== "string") return;
            try {
                const obj = JSON.parse(data);
                if (typeof obj.event !== "string") return;
                switch (obj.event) {
                    case "ping":
                        me.send("pong", obj.data, obj.id);
                        break;
                    case "close":
                        me.close(obj.data);
                        break;
                    default:
                        console.log(`======receive message: ${data}`);
                        me.createreq(obj);
                }
            } catch (err) {
                console.log(err);
                me.close();
            }
        });
        if (Array.isArray(me.module.prerequest)) {
            me.module.prerequest.forEach(obj => {
                me.createreq(obj)
            });
        }
        me.heartbeat.start();
        me.emit('open');
    }

    reconnect(socket) {
        if (this.socket !== null) {
            this.socket.removeAllListeners();
            this.socket.close();
        }
        this.socket = socket;
        this.closed = false;
        this._initsocket();
        this._send();
    }


    async createreq(obj) {
        const me = this;
        const event = obj.event;

        if (!(await me._reqwait(event))) {
            console.log('invalid event', event);
            return Promise.reject("invalid event");
        }

        try {
            const req = new wsrequest(obj, me);
            let result;
            try {
                result = await Promise.race([me.module[event](req), req.promise]);
                req.close();
            } catch (err) {
                req.error(err);
                result = Promise.reject(err);
            }
            me._reqnext(event);
            return result;
        } catch (err) {
            me._reqnext(event);
            return Promise.reject(err);
        }
    }

    _reqwait(event) {
        const me = this;
        return new Promise((resolve, reject) => {
            if (me.eventrules.has(event)) {
                const limit = me.eventrules.get(event);
                let count = (me.reqevents.get(event) || 0) + 1;
                if (limit > 0 && count > limit)
                    return resolve(false);
                me.reqevents.set(event, count);
            } else {
                return resolve(false);
            }

            if (me.requesting === true) {
                me.requestqueue.push({resolve, reject});
            } else {
                me.requesting = true;
                resolve(true);
            }
        });
    };

    _reqnext(event) {
        let count = this.reqevents.get(event) || 0;
        count = (count - 1) > 0 ? (count - 1) : 0;
        this.reqevents.set(event, count);

        if (this.requestqueue.length > 0) {
            const prm = this.requestqueue.shift();
            prm.resolve(true);
        } else {
            this.requesting = false;
        }
    }

    send(event, data, id = 0) {
        try {
            this.sendqueue.push(JSON.stringify({
                id: id,
                event: event,
                data: data
            }));
            this._send();
        } catch (err) {
            console.log(err);
        }
    }

    _send() {
        const me = this;
        if (me.closed || me.sendqueue.length <= 0 || me.sending === true) return;
        me.sending = true;
        try {
            me.heartbeat.reset();
            me.socket.send(me.sendqueue[0], (err) => {
                me.sending = false;
                if (err) {
                    if (!me.closed) me._send();
                } else {
                    me.sendqueue.shift();
                    if (me.sendqueue.length > 0) me._send();
                }
            });
        } catch (err) {
            me.sending = false;
            me._send();
        }
    }

    ping() {
        const me = this;
        if (me.closed) return;
        let feedback = false;
        let timeoutfn = setTimeout(() => {
            console.log('timeout');
            if (!feedback) me.close();
        }, 5000);
        me.socket.once('pong', () => {
            feedback = true;
            clearTimeout(timeoutfn);
        });
        me.socket.ping();
    }

    sessionset(obj){
        Object.assign(this.session, obj);
    }

    sessionget(key){
        if(key){
            return this.session[key];
        }else{
            return this.session;
        }
    }

    sessiondel(key){
        if(key){
            delete this.session[key];
        }else {
            this.session = {};
        }
    }



    async close(reason) {
        if (this.closed) return;
        this.closed = true;
        this.heartbeat.stop();
        if (this.socket !== null) {
            if (reason) {
                await new Promise((res, rej) => {
                    try {
                        this.socket.send(JSON.stringify({
                            event: "close",
                            data: reason
                        }), res);
                    } catch (e) {
                    }
                });
            }

            this.socket.close();
            this.socket = null;
        }
        this.emit('close');
    }

}


module.exports = client;
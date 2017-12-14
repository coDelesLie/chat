/**
 * Created by user1017 on 2015/11/12.
 */
"use strict";

const common = require('../utils/common');
const http = require('http');
const config = require('../utils/config');
const ENV = (process.env.NODE_ENV || 'local').toLowerCase();
const APPNAME = (process.env.APP_NAME || 'default').toLowerCase();
const GMID = (process.env.GMID || '?').toLowerCase();


class syslog {

    log() {
        let args = Array.prototype.slice.call(arguments);
        console.log.apply(console, args);
        this._chatlog({level: "log", args: args});
    }

    error() {
        let args = Array.prototype.slice.call(arguments);
        console.error.apply(console, args);
        this._chatlog({level: "error", args: args});
    }

    warn() {
        let args = Array.prototype.slice.call(arguments);
        console.warn.apply(console, args);
        this._chatlog({level: "warn", args: args});
    }

    notice() {
        let args = Array.prototype.slice.call(arguments);
        console.info.apply(console, args);
        this._chatlog({level: "notice", args: args});
    }

    trace() {
        let args = Array.prototype.slice.call(arguments);
        console.trace.apply(console, args);
        this._chatlog({level: "trace", args: args});
    }

    async _chatlog({level, args}) {
        let conf = config.envconf().chatlog;
        let channels = conf.channels[level];
        if (!Array.isArray(channels))
            return;

        let text = '';
        for (let i in args) {
            let item = args[i];
            let val = item;
            if (common.typeof(item) === 'object')
                val = JSON.stringify(item);
            else
                val = common.tostring(item);
            text = `${text}\r\n${val}`;
        }
        let system = conf.system;
        let env = `${ENV}_${APPNAME}_GM${GMID}`;
        let _send = function (channel) {
            return new Promise((success, fail) => {
                let data = '';
                let opt = {
                    method: 'post',
                    hostname: conf.host,
                    port: conf.port,
                    path: encodeURI(`/api/message/${system}/${env}/${level}/${channel}`)
                };
                let req = http.request(opt, res => {
                    res.setEncoding('utf8');
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => success({
                        status: res.statusCode,
                        headers: res.headers,
                        body: data
                    }));
                });
                req.on('error', e => fail(e));
                req.end(text);
            })
        };

        for (let c of channels) {
            try {
                await _send(c);
            } catch (err) {
                //undo
            }
        }
    }

}


module.exports = new syslog();
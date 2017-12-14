/**
 * Created by PC1011 on 2017/9/26.
 */
"use strict";
const events = require("events");
const http = require("http");
const ws = require("uws");
const url = require("url");
const querystring = require('querystring');
const client = require('./client');
const common = require('../utils/common');

const MAX_CONN = 500;

class server extends events {
    constructor(opts) {
        super();
        const me = this;
        me.server = http.createServer();
        me.wss = new ws.Server({server: me.server});
        me.allowpath = new Set();
        me.appsmap = new Map();
        me.clientsmap = new Map();
        const apps = require(`../apps/${opts.appname}/index`);
        for (let path in apps) {
            if (typeof apps[path] === 'function') {
                me.allowpath.add(path);
                me.appsmap.set(path, new apps[path](me, opts));
            }
        }

        me.wss.on('connection', async(socket) => {
            //console.log(url.parse(req.url));
            const urlobj = url.parse(socket.upgradeReq.url);
            if (!me.appsmap.has(urlobj.pathname) || me.clientsmap.size >= MAX_CONN)
                return socket.close();

            let id = null;
            do {
                id = common.gencode();
            } while (me.clientsmap.has(id));
            const cli = new client(id, socket, me.appsmap.get(urlobj.pathname));
            const session = querystring.parse(urlobj.query);
            cli.sessionset(session);
            me.clientsmap.set(cli.id, {
                path: urlobj.pathname,
                client: cli
            });
            cli.once('close', () => me.clientsmap.delete(cli.id));
        });
    }


    listen() {
        this.server.listen.apply(this.server, arguments);
    }

    broadcast(event, data, path = null, id = 0) {
        if (typeof path === "string") {
            for (let obj of this.clientsmap.values()) {
                if (path == obj.path)
                    obj.client.send(event, data, id);
            }
        } else {
            for (let obj of this.clientsmap.values())
                obj.client.send(event, data, id);
        }
    }
}

module.exports = server;
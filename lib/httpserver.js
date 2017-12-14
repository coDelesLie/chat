/**
 * Created by user1017 on 2017/3/13.
 */
"use strict";

const http = require('http');
const querystring = require('querystring');
const url = require('url');


class httpserver {
    constructor() {
        this.getmap = new Map();
        this.postmap = new Map();
        this.server = http.createServer(this.reception.bind(this));
    }

    reception(req, res) {
        const urlobj = url.parse(req.url, true);

        switch (req.method) {
            case 'GET':
            {
                let fn = this.getmap.get(urlobj.pathname);
                if (typeof fn !== "function")
                    return this.responseerror(res, "no such method", 404);
                return fn(req, res, urlobj);
            }
            case 'POST':
            {
                let fn = this.postmap.get(urlobj.pathname);
                if (typeof fn !== "function")
                    return this.responseerror(res, "no such method", 404);
                let body = "";
                req.on('data', (data)=> {
                    body += data;
                }).once('end', ()=> {
                    urlobj.body = body;
                    fn(req, res, urlobj);
                }).on('error', ()=>{
                    this.responseerror(res, "no such method", 404);
                });
                break;
            }
            default :
                return this.responseerror(res, "no such method", 404);
        }
    }

    responseok(res, msg, code = 200) {
        res.statusCode = code;
        res.end(JSON.stringify({status: "ok", msg: msg}));
        return;
    }

    responseerror(res, error, code = 500) {
        res.statusCode = code;
        res.end(JSON.stringify({status: "error", error: error}));
        return;
    }

    listen() {
        const server = this.server;
        const args = arguments;
        return new Promise(function (resolve, reject) {
            server.on('listening', function () {
                resolve();
            });
            server.on('error', function (err) {
                console.log(err);
                reject();
            });
            server.listen.apply(server, args);
        });

    }

    get(path, fn) {
        if (typeof path !== 'string' || typeof fn !== 'function')
            throw new Error("invalid params on httpserver.get");
        this.getmap.set(path, fn);
    }

    post(path, fn) {
        if (typeof path !== 'string' || typeof fn !== 'function')
            throw new Error("invalid params on httpserver.post");
        this.postmap.set(path, fn);
    }
}


module.exports = httpserver;
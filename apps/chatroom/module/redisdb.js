/**
 * Created by PC1011 on 2017/11/30.
 */
"use strict";
const redis = require('ioredis');
const config = require('../../../utils/config.js');

const JSON_CMD = ["JSON.SET", "JSON.GET", "JSON.DEL", "JSON.ARRAPPEND", "JSON.TYPE"];

class redisdb {
    constructor(chatkey) {
        const opts = config.get("redisconf")||{};
        this.client = new redis(opts);
        this.chatkey = chatkey;
        this.jsonfn = new Map();
        for (let cmd of JSON_CMD) {
            this.jsonfn.set(cmd, this.client.createBuiltinCommand(cmd).string);
        }
    }

    async init() {
        const me = this;
        try {
            const type = await me.jsonfn.get("JSON.TYPE").call(me.client, me.chatkey);
            if (type === "array") {
                const arr = await me._jsonget(me.chatkey);
                return arr;
            } else {
                await me._jsonset(me.chatkey, []);
                return [];
            }
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async append(obj, path = ".") {
        const me = this;
        try{
            let arg = [me.chatkey, path];
            let arr = [];
            if (Array.isArray(obj)) {
                for (let o of obj)
                    arr.push(JSON.stringify(o));
            }else{
                arr.push(JSON.stringify(obj));
            }
            arg = arg.concat(arr);
            await me.jsonfn.get("JSON.ARRAPPEND").apply(me.client, arg);
        }catch (err){
            console.log(err);
            return Promise.reject(err);
        }
    }

    async cover(obj){
        const me = this;
        try{
            await me._jsonset(me.chatkey, obj);
        }catch (err){
            console.log(err);
            return Promise.reject(err);
        }
    }


    async _jsonget(key, path) {
        const me = this;
        let res = await me.jsonfn.get("JSON.GET").call(me.client, key, path);
        return JSON.parse(res);
    }

    async _jsonset(key, value, path = ".") {
        const me = this;
        let val = JSON.stringify(value);
        await me.jsonfn.get("JSON.SET").call(me.client, key, path, val);
    }
}

module.exports = redisdb;



/**
 * Created by PC1011 on 2017/11/22.
 */
"use strict";
const querystring = require('querystring');
const config = require('../../utils/config.js');
const request = require('request');
const redisdb = require('./module/redisdb');
const MAX_CHAT = 500;
const CHATROOMID = process.env.CHATROOMID;


class chat {
    constructor(server, opts = {}) {
        this.server = server;
        this.opts = opts;
        this.eventrules = config.get("chat").eventrules;
        this.prerequest = [{id: 0, event: "init"}];
        this.sequence = 0;
        this.covercount = 0;
        this.chatqueue = [];
        this.redisdb = new redisdb("redis-key");
        this._loadchat();
    }

    async init(request) {
        const me = this;
        try {
            const {uid, cid, cpassword} = request.cli.sessionget();
            if(cid !== CHATROOMID)
                return request.cli.close("enter_wrong_hole");

            const api = `${config.envconf().apihost}/api/wsv2_0/user_chatroom_verify`;
            let qs = querystring.stringify({
                cid: CHATROOMID,
                cpassword:cpassword,
                uid:uid
            });
            const res = await new Promise((res, rej) => {
                request(`${api}?${qs}`, (err, response, body) => {
                    if (err) return rej(err);
                    try {
                        let rsp = JSON.parse(body);
                        res(rsp);
                    } catch (e) {
                        rej(e)
                    }
                });
            });

            if (res.status !== "ok") {
                request.cli.close(res.error_code || "illegal_request");
                return;
            }
            request.cli.sessionset({user:res.user});
            const userobj = {
                uid:res.user.uid,
                nickname:res.user.nickname
            };
            let flag = false;
            for (let msg of me.chatqueue) {
                if (msg.user.uid == userobj.uid) {
                    if (msg.user.nickname !== userobj.nickname) {
                        msg.user = userobj;
                        flag = true;
                    }
                }
            }

            request.cli.send("init", {user: userobj});
            const chatinfo = {
                ation: "replace",
                chatqueue: me.chatqueue
            };
            if (flag) {
                me.server.broadcast("chat", chatinfo, '/chat');
            } else {
                request.cli.send("chat", chatinfo);
            }
            return;
        } catch (err) {
            console.error(err);
            request.cli.close("unexpected_error");
        }
    }


    async send(request) {
        const me = this;

        const params = request.params;
        if (!(params.msgtype && params.content)) {
            return request.response({status: "error"});
        }

        let user = request.cli.sessionget("user");
        me.chat(user, params.msgtype, params.content);

        return request.response({status: "ok"});
    }

    async chat(user, msgtype, content) {
        const me = this;
        const allowtype = new Set(['text', 'imgurl', 'videourl', 'list'/*, 'imgbuf', 'videourl', 'videobuf'*/]);

        let timestamp = Date.now();
        let sequence = Number(`${timestamp}${me._getsequence()}`);
        let msgobj = {user, msgtype, content, timestamp, sequence};
        await me._savechat(msgobj);
        console.log(`[${common.now()}]chat message: ${JSON.stringify(msgobj)}`);
        me.server.broadcast("chat", {
            ation: "concat",
            chatqueue: [msgobj]
        }, '/chat');
    }

    _getsequence() {
        this.sequence++;
        if (this.sequence > 999) {
            this.sequence = 0;
            return `000`;
        } else if (this.sequence > 99) {
            return this.sequence;
        } else if (this.sequence > 9) {
            return `0${this.sequence}`;
        } else {
            return `00${this.sequence}`;
        }
    }


    async _loadchat() {
        const me = this;
        try {
            let history = await me.redisdb.init();
            if (Array.isArray(history)) {
                me.chatqueue = history.concat(me.chatqueue);
                while (me.chatqueue.length > MAX_CHAT) {
                    me.chatqueue.shift();
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    async _savechat(msgobj) {
        const me = this;
        me.chatqueue.push(msgobj);
        if (me.chatqueue.length > MAX_CHAT) {
            me.chatqueue.shift();
            me.covercount++;
        }
        try {
            if(me.covercount>MAX_CHAT){
                me.covercount = 0;
                await me.redisdb.cover(me.chatqueue);
            }else{
                await me.redisdb.append(msgobj);
            }
        } catch (err) {
            await me.redisdb.cover(me.chatqueue).catch(console.log);
        }
    }


}


module.exports = chat;

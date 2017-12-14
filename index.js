"use strict";

//const request = require('request');

const config = require('./utils/config.js');
//const syslog = require('./utils/syslog.js');
const server = require('./lib/server');
const request = require('request');
const querystring = require('querystring');

const CHATROOMID = process.env.CHATROOMID;

class index {
    constructor() {
        this.server = null;
        //this.backendmode = null;
    }

    async start() {
        const me = this;
        try {
            process.on('exit', function () {
                console.log("betting-bot will be shutdown, Goodbye!");
            });
            process.on('uncaughtException', (err) => {
                console.log("error", "uncaught_exception", err, err.stack);
            });
            process.on('unhandledRejection', (err) => {
                console.log("error", "unhandledRejection", err, err.stack);
            });
            let api = `${config.envconf().apihost}/api/wsv2_0/user_chatroom_table_profile`;
            let qs = querystring.stringify({cid: CHATROOMID});
            // const profile = await new Promise((res, rej) => {
            //     request(`${api}?${qs}`, (err, response, body) => {
            //         if (err) return rej(err);
            //         try {
            //             let rsp = JSON.parse(body);
            //             res(rsp);
            //         } catch (e) {
            //             rej(e)
            //         }
            //     });
            // });
            // console.log('profile: ', profile);
            const profile = {status:"ok", port:60000};

            if(profile.status !=="ok")
                throw profile;

            profile.appname = "chatroom";//暂时写死chatroom
            
            config.load(__dirname, `apps/${profile.appname}/config`);

            me.server = new server(profile);
            me.server.listen(profile.port);
            console.log("server listen port", profile.port);


            const process_exit = async function (signal) {
                setTimeout(() => {
                    console.error('backend exit timeout, sorry');
                    process_exit(1);
                }, 30000);
                try {
                    //await me.backend.exit();
                    process.exit(0);
                } catch (err) {
                    console.error('something went wrong when exiting backend', err);
                    process.exit(1);
                }
            };
            //退出进程处理 (结束讯号）
            process.on('SIGTERM', process_exit).on('SIGBREAK', process_exit).on('SIGINT', process_exit);
        } catch (err) {
            console.error("nodejs start error",err);
        }
    }

}

new index().start();
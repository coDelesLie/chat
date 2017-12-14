/**
 * Created by PC1011 on 2017/11/23.
 */
"use strict";
const App = require("./app.js");
const PORT = process.env.PORT || 60000;

class index {
    constructor() {
        this.app = new App();
    }

    async start() {
        const me = this;
        try {
            process.on('exit', ()=> {
                console.log("chatroom daemon will be shutdown, Goodbye!");
            });
            process.on('uncaughtException', (err) => {
                console.log("error", "uncaught_exception", err, err.stack);
            });
            process.on('unhandledRejection', (err) => {
                console.log("error", "unhandledRejection", err, err.stack);
            });

            const exitfn = async function (signal) {
                setTimeout(() => {
                    console.error('daemon exit timeout, sorry');
                    process_exit(1);
                }, 30000);
                try {
                    //await me.backend.exit();
                    process.exit(0);
                } catch (err) {
                    console.error('something went wrong when exiting daemon', err);
                    process.exit(1);
                }
            };
            //退出进程处理 (结束讯号）
            process.on('SIGTERM', exitfn).on('SIGBREAK', exitfn).on('SIGINT', exitfn);

            await me.app.listen(PORT);
            console.log(`chatroom daemon is listren on ${PORT}`);
        } catch (err) {
            console.log(`chatroom daemon start error`, err);
        }
    }
}

new index().start();
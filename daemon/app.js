/**
 * Created by PC1011 on 2017/11/23.
 */
const httpserver = require('../lib/httpserver.js');
const exec = require('child_process').exec;
const COMMAND = {
    START: "`nodejs-service start CHATROOM-${roomid}.service`",
    STOP: "`nodejs-service stop CHATROOM-${roomid}.service`"
};

class controller {
    constructor() {
        this.instancemap = new Set();
    }

    async start(roomid) {
        const me = this;
        const cmd = eval(COMMAND.START);
        await me._exec(cmd);
        me.instancemap.add(roomid);
    }

    async stop(roomid) {
        const me = this;
        const cmd = eval(COMMAND.START);
        await me._exec(cmd);
        me.instancemap.delete(roomid);
    }

    _exec(cmd) {
        return new Promise(function (resolve, reject) {
            exec(cmd, function (error, stdout, stderr) {
                if (error) reject(error);
                else resolve(stdout);
            });
        });
    }
}

const app = new httpserver();
const appctrl = new controller();


app.get('/chatroomctrl', async function (req, res, urlobj) {
    try {
        const {action, roomid} = urlobj.query;
        if (!(typeof action === "string" && roomid))
            return app.responseerror(res, "invalid_params");
        if (typeof appctrl[action] === "function") {
            await appctrl[action](roomid);
            return app.responseok(res);
        } else {
            return app.responseerror(res, "invalid_request");
        }
    } catch (err) {
        return app.responseerror(res, err);
    }
});


module.exports = app;
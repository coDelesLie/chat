/**
 * Created by PC1011 on 2017/9/30.
 */
"use strict";

class wsrequest {
    constructor(msg={}, cli) {
        this.id = msg.id || 0;
        this.event = msg.event || "";
        this.params = msg.data || {};
        this.msg = msg;
        this.cli = cli;
        this.promise = new Promise((resolve,reject)=>{
            this._promise = {resolve, reject};
        });
        this.closed = false;
        this.responsemap = new Map();
    }

    response(data, event){
        event = event||this.event;
        if(this.responsemap.has(event)){
            let _data = this.responsemap.get(event);
            if(typeof _data === 'object' && _data !==null && typeof data === 'object' ){
                this.responsemap.set(event, Object.assign(_data, data));
            }else{
                this.responsemap.set(event, data);
            }
        }else {
            this.responsemap.set(event, data);
        }
    }

    send(event, data){
        this.cli.send(event, data, this.id);
    }

    async close(result){
        if(this.closed) return;
        this.closed = true;
        this.responsemap.forEach((data, event)=>{
            this.cli.send(event, data, this.id);
        });
        this._promise.resolve(result);
    }


    async error(err){
        if(this.closed) return;
        this.closed = true;
        let msg = "";
        if (err instanceof Error)
            msg = err.stack;
        else if (typeof err =='object' && err!=null) {
            try {
                msg = JSON.stringify(err);
            } catch (e) {
                msg = String(err);
            }
        } else {
            msg = String(err);
        }
        this._promise.reject(msg);
        this.cli.send('error', msg, this.id);
    }

}


module.exports = wsrequest;
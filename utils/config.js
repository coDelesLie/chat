"use strict";
const fs = require('fs');
const path = require('path');
const common = require('./common.js');

const env = (process.env.NODE_ENV || 'local').toLowerCase();
const appname = (process.env.APP_NAME || 'default').toLowerCase();
const configs = new Map();
const dfreloadtime = 60000;

class config {
    constructor() {
        this.filepaths = new Set();
        this.reload = null;
        this.envfile = path.join(__dirname, '../config/envconf', `${env}_${appname}.json`);
        this._loadenvconf();
        this.load(__dirname, '../config');
    }

    load() {
        const confpath = path.join.apply(null, arguments);
        try {
            this._loadconf(confpath);
            this.filepaths.add(confpath);
        } catch (err) {
            console.log('config load error');
        }
    }


    _loadconf(confpath) {
        let files = fs.readdirSync(confpath);
        files.forEach(function (file) {
            if (file.endsWith('.json')) {
                let filename = file.slice(0, -5);
                let jsonfile = fs.readFileSync(path.join(confpath, file), "utf8");
                try {
                    jsonfile = JSON.parse(jsonfile);
                    configs.set(filename, jsonfile);
                } catch (err) {
                    console.log(`load config [${filename}] error`);
                }
            }
        });
    }

    _loadenvconf() {
        const envfile = this.envfile;
        if (fs.statSync(envfile).isFile()) {
            let jsonfile = fs.readFileSync(envfile, "utf8");
            try {
                jsonfile = JSON.parse(jsonfile);
                configs.set('envconf', jsonfile);
            } catch (err) {
                console.log(`load envconf [${envfile}] error`);
            }
        }
    }


    setreload(reloadtime) {
        let me = this;
        if (me.reload !== null)
            clearInterval(me.reload);
        reloadtime = Number.isInteger(reloadtime) ? reloadtime : dfreloadtime;
        me.reload = setInterval(function () {
            me._loadenvconf();
            me.filepaths.forEach((cpath) => {
                me._loadconf(cpath);
            });
        }, reloadtime)

    }


    get(filename) {
        return common.clone(configs.get(filename) || {});
    }

    envconf() {
        return common.clone(configs.get('envconf') || {});
    }

    commonconf() {
        return common.clone(configs.get('commonconf') || {});
    }


}

module.exports = new config();


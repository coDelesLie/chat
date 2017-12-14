/**
 * @module  Common  通用工具模块
 */
"use strict";
const _ = require('underscore');

/**
 * @class   Common  通用工具类
 * */
class Common {
    constructor() {
    }

    /**
     * @method      invokecallback      调用函数（参数各自传入）
     *
     * 当第一个参数是{function}时：
     * @param       {function}       arguments[0]        调用该函数，绑定对象为null
     * @param       {...*}           arguments[...]      剩余参数作为函数调用参数传入
     * @return      {boolean}                            是否调用成功
     * 否则当第二个参数是{function}时：
     * @param       {object}        arguments[0]        函数调用时的绑定对象
     * @param       {function}      arguments[1]        调用该函数，绑定对象为arguments[0]
     * @param       {...*}          arguments[...]      剩余参数作为函数调用参数传入
     * @return      {boolean}                           是否调用成功
     *
     * */
    invokecallback() {
        if (arguments.length > 0) {
            if (typeof(arguments[0]) === 'function') {
                arguments[0].apply(null, Array.prototype.slice.call(arguments, 1));
                return true;
            } else if (typeof arguments[1] === 'function') {
                arguments[1].apply(arguments[0], Array.prototype.slice.call(arguments, 2));
                return true;
            } else return false;
        }
    }

    /**
     * @method      invokeapply      调用函数（参数作为数组传入）
     *
     * 当第一个参数是{function}时：
     * @param       {function}      arguments[0]        调用该函数，绑定对象为null
     * @param       {array}         arguments[1]        数组内元素作为函数调用参数传入
     * @return      {boolean}                           是否调用成功
     * 否则当第二个参数是{function}时：
     * @param       {object}        arguments[0]        函数调用时的绑定对象
     * @param       {function}      arguments[1]        调用该函数，绑定对象为arguments[0]
     * @param       {array}         arguments[2]        数组内元素作为函数调用参数传入
     * @return      {boolean}                           是否调用成功
     *
     * */
    invokeapply() {
        if (arguments.length > 0) {
            if (typeof(arguments[0]) === 'function') {
                var arg = Array.prototype.slice.call(arguments[1], 0);
                if (Array.isArray(arg))
                    arguments[0].apply(null, arg);
            } else if (typeof arguments[1] === 'function') {
                var arg = Array.prototype.slice.call(arguments[2], 0);
                if (Array.isArray(arg))
                    arguments[1].apply(arguments[0], arg);
            }
        }
    }

    /**
     * @method      objtomap      将{object}转换为{map}
     *
     * @param       {object}      obj     要转换的对象
     * @return      {map|*}               参数为对象时返回转换成功的{map},否则返回参数
     * */
    objtomap(obj) {
        if (this.typeof(obj) === 'object') {
            let map = new Map();
            for (let k of Object.keys(obj))
                map.set(k, obj[k]);
            return map;
        } else {
            return obj;
        }
    }

    /**
     * @method      maptoobj      将{map}转换为{object}
     *
     * @param       {object}      obj     要转换的对象
     * @return      {map|*}               参数为对象时返回转换成功的{map},否则返回参数
     * */
    maptoobj(map) {
        if (this.typeof(map) === 'map') {
            let obj = Object.create(null);
            for (let item of map.entries()) {
                obj[item[0]] = item[1];
            }
            return obj;
        } else {
            return map;
        }
    }

    /**
     * @method      array_remove      删除数组中所符合给予的值
     *
     * @param       {array}     array       数组
     * @param       {*}         value       需要删除的对象
     * @param       {boolean}   all         若true，将删除数据组中所有符合给予的值，false只删除找到的第一个
     * @return      {array}                 返回修改完后的数组
     */
    array_remove(array, value, all) {
        for (var index = array.length; index >= 0; index--)
            if (_.isEqual(array[index], value)) {
                array.splice(index, 1);
                if (all !== true)
                    break;
            }
        return array;
    }

    /**
     * @method      array_remove      所给予的值，返回人类可以读的档案大小
     *
     * @param       {int}       bytes       大小数值值
     * @param       {boolean}   iec         IEC模式或SI模式（预设为SI）
     * @return      {string}                返回人类可读档案大小字串
     */
    getfilesize(bytes, iec) {
        iec = !!iec;
        bytes = this.tonumber(bytes, -1);
        var thresh = iec ? 1024 : 1000;
        if (Math.abs(bytes) < thresh)
            return bytes + ' B';
        var units = iec
            ? ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
            : ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + ' ' + units[u];
    }

    /**
     * @method      now      获得当前时间的格式化字符串（****-**-** **:**:**）
     *
     * @return      {string}        返回当前时间的格式化字符串
     * @example     return          "1970-00-00 00:00:00"
     */
    now() {
        var now = new Date();
        return now.getFullYear() + '-' +
            (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + '-' +
            (now.getDate() < 10 ? '0' : '') + now.getDate() + ' ' +
            (now.getHours() < 10 ? '0' : '') + now.getHours() + ':' +
            (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ':' +
            (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();
    }


    datetimezoneformat(date, timezone) {
        if (!(date instanceof Date))
            return date;
        let options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: timezone || "UTC"
        };
        try {
            let tz = new Intl.DateTimeFormat("zh-CN", options).format(date);
            return this.date2datetime(new Date(tz));
        } catch (err) {
            return this.date2datetime(date);
        }
    }

    /**
     * @method      date2datetime      获得指定时间的格式化字符串（****-**-** **:**:**）
     *
     * @param       {Date}          指定的Date对象
     * @return      {string}        返回指定时间的格式化字符串
     * @example     return          "1970-00-00 00:00:00"
     */
    date2datetime(date) {
        return date.getFullYear() + '-' +
            (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1) + '-' +
            (date.getDate() < 10 ? '0' : '') + date.getDate() + ' ' +
            (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' +
            (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':' +
            (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
    }

    /**
     * @method      time      获得当前时间的时间戳
     *
     * @param       {boolean}       milisecond          指定返回是否为毫秒值
     * @return      {int}                               当milisecond为true时返回毫秒值，否则返回秒值
     */
    time(milisecond) {
        if (milisecond)
            return new Date().getTime();
        else
            return Math.floor(new Date().getTime() / 1000);
    }

    /**
     * @method      rndweightitem      从列表中随机（根据值大小加权）抽取一个成员
     *
     * @param       {object|array|map|set}       probability        随机值列表
     * @return      {*}                                             返回键（当probability为{set}时返回值），当参数不正确时返回false
     */
    rndweightitem(probability) {
        switch (this.typeof(probability)) {
            case 'object':
            case 'array':
                return this.rndweightobj(probability);
            case 'map':
            case 'set':
                return this.rndweightsetmap(probability);
            default:
                return false;
        }
    }

    /**
     * @method      rndweightobj      从指定对象或数组中随机（根据值大小加权）抽取一个成员，返回其键值
     *
     * @param       {object|array}       probability          随机值列表
     * @return      {string|false}                            返回键，当参数不正确时返回false
     */
    rndweightobj(probability) {
        let type = this.typeof(probability);

        if ((type !== 'object' && type !== 'array') || this.count(probability) <= 0)
            return false;

        let all = 0;
        for (let key in probability)
            all += parseInt(probability[key]);
        let random = this.random(1, all);
        for (let key in probability) {
            random -= probability[key];
            if (random <= 0)
                return key;
        }
    }

    /**
     * @method      rndweightsetmap      从指定{map}或{set}中随机（根据值大小加权）抽取一个成员
     *
     * @param       {map|set}       probability          随机值列表
     * @return      {*}                                  当probability为{map}时返回键，为{set}时返回值
     *                                                   当参数不正确时返回false
     */
    rndweightsetmap(probability) {
        let type = this.typeof(probability);

        if ((type !== 'map' && type !== 'set') || probability.size <= 0)
            return false;

        let all = 0;
        for (let value of probability.values())
            all += parseInt(value, 10);
        let random = this.random(1, all);
        if (type === 'map') {
            for (let key of probability.keys()) {
                random -= probability.get(key);
                if (random <= 0)
                    return key;
            }
        } else {
            for (let value of probability.values()) {
                random -= value;
                if (random <= 0)
                    return value;
            }
        }
    }

    /**
     * @method      rndweightarray      不断从指定数组中随机（根据值大小加权）取出一个成员，根据其键从另一个数组中取出对应成员，push到返回的数组中
     *
     * @param       {array}       itemarray       获取值列表
     * @param       {array}       probability     参考的随机值列表
     * @param       {boolean}     unique          最后结果是否去掉重复值
     * @return      {array}                       返回数组，当参数不正确时返回false
     */
    rndweightarray(itemarray, probability, unique) {
        if (this.count(itemarray) !== this.count(probability) || this.empty(itemarray) || !this.isarray(itemarray) || !this.isarray(probability))
            return false;
        else {
            let result = [];
            for (let i = 0; i < probability.length; i++)
                probability[i] = probability[i] < 0 ? 0 : probability[i];
            for (let i = 0; i < itemarray.length; i++) {
                let key = this.rndweightitem(probability);
                result.push(itemarray[key]);
                delete probability[key];
                delete itemarray[key];
            }
            if (unique === true)
                result = this.unique(result);
            return result;
        }
    }

    chr(code) {
        code = this.tonumber(code);
        if (code > 0xFFFF) {
            code -= 0x10000;
            return String.fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 0x3FF));
        }
        return String.fromCharCode(code);
    }

    gencode(len) {
        len = this.tonumber(len, 0);
        len = len <= 0 ? 8 : len;
        let result = '';
        for (let i = 0; i < len; i++) {
            switch (this.random(1, 3)) {
                case 1:
                    result += this.chr(this.random(48, 57));
                    break;

                case 2:
                    result += this.chr(this.random(65, 90));
                    break;

                case 3:
                    result += this.chr(this.random(97, 122));
                    break;
            }
        }
        return result;
    }


    /**
     * @method      tostring      转换成字符串
     *
     * @param       {*}       value       等待转换的值
     * @return      {string}              当参数为对象且有message成员时返回该成员，当参数为undefined时返回''，其他的调用自身toString方法
     */
    tostring(value) {
        let strvalue = '';
        switch (typeof(value)) {
            case 'object':
                if (value !== null)
                    strvalue = (value instanceof Object && value.message) ? value.message : value.toString();
                break;

            case 'undefined':
                break;

            default:
                strvalue = value.toString();
        }
        return strvalue;
    }

    /**
     * @method      tonumber      转换为数字
     *
     * @param       {*}          value          需要转换的参数
     * @param       {number}     decimal        结果的小数点后位数
     * @param       {number}     abs            是否转换成绝对值
     * @return      {number|string}             返回结果取决于decimal和abs
     */
    tonumber(value, decimal, abs) {
        abs = abs === true;
        decimal = Number(decimal);
        if (isNaN(decimal))
            decimal = 4;
        let number = Number(value);
        number = isNaN(number) ? 0 : Number(decimal < 0 ? number : number.toFixed(decimal));
        return abs === true ? Math.abs(number) : number;
    }

    /**
     * @method      ctype_upper      检验参数是否一个全为大写字母的字符串
     *
     * @param       {*}          value      参数会被本类的tostring方法转换成字符串
     * @return      {boolean}               返回{boolean}
     */
    ctype_upper(value) {
        value = this.tostring(value);
        let regex_upper = /^([A-Z]*)$/g;
        return regex_upper.test(value);
    }

    /**
     * @method      ctype_lower      检验参数是否一个全为小写字母的字符串
     *
     * @param       {*}          value      参数会被本类的tostring方法转换成字符串
     * @return      {boolean}               返回{boolean}
     */
    ctype_lower(value) {
        value = this.tostring(value);
        let regex_lower = /^([a-z]*)$/g;
        return regex_lower.test(value);
    }

    /**
     * @method      ctype_alpha      检验参数是否一个全为字母的字符串
     *
     * @param       {*}          value      参数会被本类的tostring方法转换成字符串
     * @return      {boolean}               返回{boolean}
     */
    ctype_alpha(value) {
        value = this.tostring(value);
        let regex_alpha = /^([a-z]*)$/ig;
        return regex_alpha.test(value);
    }

    /**
     * @method      ctype_alnum      检验参数是否一个全为字母数字的字符串
     *
     * @param       {*}          value      参数会被本类的tostring方法转换成字符串
     * @return      {boolean}               返回{boolean}
     */
    ctype_alnum(value) {
        value = this.tostring(value);
        let regex_alpha = /^([a-z0-9]*)$/ig;
        return regex_alpha.test(value);
    }

    /**
     * @method      filter_var      根据参数检验value是否为合法的IP或者email
     *
     * @param       {string}        value           等待检验的值
     * @param       {string}        filter_type     'ip'或者'email'
     * @param       {string}        filter_flag     'ipv4'或者'ipv6'
     * @return      {boolean}                       返回{boolean}
     */
    filter_var(value, filter_type, filter_flag) {
        let pass = false;
        switch (filter_type) {
            case 'ip':
                switch (filter_flag) {
                    case 'ipv4':
                        let ipv4re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                        pass = ipv4re.test(value);
                        break;
                    case 'ipv6':
                        let ipv6re = /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/;
                        pass = ipv6re.test(value);
                        break;
                    default :
                        pass = ipv4re.test(value) || ipv4re.test(value);
                }
                break;

            case 'email':
                let mailre = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                pass = mailre.test(value);
                break;
            default :
        }
        return pass;
    }

    /**
     * @method      validatepattern      根据参数检验value是否为合法的IP或者email
     *
     * @param       {*}             data           等待检验的值
     * @param       {string}        filter_type     'ip'或者'email'
     * @param       {string}        filter_flag     'ipv4'或者'ipv6'
     * @return      {boolean}                       返回{boolean}
     */
    validate(validatepattern, data) {
        if (this.empty(validatepattern) || this.typeof(validatepattern) != 'object')
            return true;
        let datatype = this.typeof(data);
        if (datatype !== 'object' && datatype !== 'array')
            data = {};
        for (let key in validatepattern) {
            if (!this.validate_value(data[key], validatepattern[key]))
                return false;
        }
        return true;
    }

    /**
     * @method      validatemsg      根据检验规则列表检验数据列表，如果有不通过的返回信息提醒不通过的项目
     *
     * @param       {*}             validatepattern     检验规则列表
     * @param       {object|array}  data                待检验的数据列表
     * @return      {string}                            返回提醒字符串
     */
    validatemsg(validatepattern, data) {
        if (this.empty(validatepattern) || this.typeof(validatepattern) != 'object')
            return '';
        let datatype = this.typeof(data);
        if (datatype !== 'object' && datatype !== 'array')
            data = {};
        let needed = '';
        for (let key in validatepattern) {
            if (!this.validate_value(data[key], validatepattern[key]))
                needed += needed !== '' ? ', ' + key : key;
        }
        return (needed !== '') ? 'Parameters Invalid: ' + needed : '';
    }

    /**
     * @method      validate_value      多功能参数验证器
     *
     * @param       {*}                         value           等待检验的值
     * @param       {string|object|array}       validates       是{string}时validates代表验证规则    @example 'min:2' 'number+'
     *                                                          是{object|array}时验证value是否在validates里面
     * @return      {boolean}                                   返回{boolean}
     */
    validate_value(value, validates) {

        if (typeof (validates) == "object")
            return this.inarray(value, validates);
        else {
            let pass = true;
            let validatearr = this.tostring(validates).split(',');
            let tmp = null;

            for (let i = 0; i < validatearr.length; i++) {

                let validate = validatearr[i],
                    extend = '',
                    type = '';
                if (validate.indexOf(':') < 0)
                    type = validate;
                else {
                    type = validate.split(':', 1);
                    extend = validate.split(':')[1];
                }

                switch (type.toString()) {
                    case 'match' :
                        if (extend !== null)
                            pass = extend == value;
                        break;

                    case 'array' :
                        pass = (typeof (value) == 'object');
                        break;

                    case  'array+' :
                        pass = (typeof (value) == 'object') && !this.empty(value);
                        break;

                    case  'boolean':
                        pass = typeof (value) === 'boolean';
                        break;

                    case  'int':
                        tmp = parseInt(value, 10);
                        pass = !isNaN(tmp) && value == tmp;
                        break;

                    case  'int+':
                        tmp = parseInt(value, 10);
                        pass = !isNaN(tmp) && tmp != 0;
                        break;

                    case  'number':
                        pass = !isNaN(parseFloat(value));
                        break;

                    case  'number+':
                        tmp = parseFloat(value);
                        pass = !isNaN(tmp) && tmp != 0;
                        break;

                    case 'alphabet':
                        switch (extend) {
                            case 'upper':
                                pass = this.ctype_upper(value);
                                break;

                            case 'lower':
                                pass = this.ctype_lower(value);
                                break;

                            default :
                                pass = this.ctype_alpha(value);
                        }
                        break;

                    case 'alphanumber':
                        pass = this.ctype_alnum(value);
                        break;

                    case 'ip':
                        switch (extend) {
                            case 'v4':
                                pass = this.filter_var(value, 'ip', 'ipv4');
                                break;

                            case 'v6':
                                pass = this.filter_var(value, 'ip', 'ipv6');
                                break;

                            default :
                                pass = this.filter_var(value, 'ip');
                        }
                        break;

                    case 'email':
                        pass = this.filter_var(value, 'email');
                        break;

                    case 'must':
                        pass = (!(value === null || value === undefined));
                        break;

                    case 'min':
                        extend = parseInt(extend, 10);
                        if (!this.empty(extend)) {
                            if (typeof (value) == 'object')
                                pass = this.count(value) >= extend;
                            else
                                pass = this.tostring(value).length >= extend;
                        }
                        break;

                    case 'max':
                        extend = parseInt(extend, 10);
                        if (!this.empty(extend)) {
                            if (typeof (value) == 'object') {
                                pass = this.count(value) <= extend;
                            } else {
                                pass = this.tostring(value).length;
                            }
                        }
                        break;

                    case 'len':
                        extend = parseInt(extend, 10);
                        if (!this.empty(extend)) {
                            if (typeof (value) == 'object')
                                pass = this.count(value) === extend;
                            else
                                pass = this.tostring(value).length === extend;
                        }
                        break;

                    default :
                        if (typeof (validatearr) == 'object')
                            pass = this.inarray(value, validatearr);
                        else
                            pass = value.match(validate);
                }
                if (!pass)
                    return pass;
            }
            return true;
        }
    }

    /**
     * @method      empty      检验参数是否为空，空包括如下[undefined, null, false, 0, '', '0'，对象无可遍历成员]
     *
     * @param       {*}             mixed_var       等待检验的值
     * @return      {boolean}                       返回{boolean}
     */
    empty(mixed_var) {
        let key, i, len, emptyValues = [undefined, null, false, 0, '', '0'];
        for (i = 0, len = emptyValues.length; i < len; i++)
            if (mixed_var === emptyValues[i])
                return true;
        switch (this.typeof(mixed_var)) {
            case 'array' :
                return (0 === mixed_var.length);
            case 'object' :
                for (key in mixed_var)
                    return false;
                return true;
            case 'map' :
            case 'set' :
                return (0 === mixed_var.size);
            default :
                return false;
        }
    }

    /**
     * @method      isint      检验参数是否为整数
     *
     * @param       {*}             mixed_var       等待检验的值
     * @return      {boolean}                       返回{boolean}
     */
    isint(mixed_var) {
        return mixed_var === +mixed_var && isFinite(mixed_var) && !(mixed_var % 1);
    }

    /**
     * @method      isfloat      检验参数是否为浮点数
     *
     * @param       {*}             mixed_var       等待检验的值
     * @return      {boolean}                       返回{boolean}
     */
    isfloat(mixed_var) {
        return (typeof(mixed_var) === 'number' && mixed_var !== parseInt(mixed_var, 10)) ? true : false;
    }

    /**
     * @method      isnumeric      检验参数是否为字面数值
     *
     * @param       {*}             mixed_var       等待检验的值
     * @return      {boolean}                       返回{boolean}
     */
    isnumeric(mixed_var) {
        let whitespace =
            " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
        return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -
                1)) && mixed_var !== '' && !isNaN(mixed_var);
    }

    /**
     * @method      isobj      检验参数是否为除null外的object类型
     *
     * @param       {*}             mixed_var       等待检验的值
     * @return      {boolean}                       返回{boolean}
     */
    isobj(mixed_var) {
        return mixed_var !== null && typeof mixed_var === 'object';
    }

    /**
     * @method      isarray      检验参数是否为数组
     *
     * @param       {*}             mixed_var       等待检验的值
     * @return      {boolean}                       返回{boolean}
     */
    isarray(mixed_var) {
        if (mixed_var !== null && typeof mixed_var !== 'object')
            return false;
        return Object.prototype.toString.call(mixed_var) === '[object Array]';
    }

    /**
     * @method      ismap      检验参数是否为{map}
     *
     * @param       {*}             mixed_var       等待检验的值
     * @return      {boolean}                       返回{boolean}
     */
    ismap(mixed_var) {
        return this.typeof(mixed_var) === 'map';
    }

    /**
     * @method      isset      检验参数是否为{set}
     *
     * @param       {*}             mixed_var       等待检验的值
     * @return      {boolean}                       返回{boolean}
     */
    isset(mixed_var) {
        return this.typeof(mixed_var) === 'set';
    }

    /**
     * @method      unique      从指定对象或数组中筛选所有不重复的值
     *
     * @param       {object|array}       mixed_var       指定的对象或数组
     * @return      {array|*}                            返回不重复的值列表（数组）
     *                                                   当参数不正确时返回原参数
     */
    unique(mixed_var) {
        if (typeof(mixed_var) === 'object') {
            if (mixed_var instanceof Array)
                return mixed_var.filter(function (elem, pos, arr) {
                    return arr.indexOf(elem) == pos;
                });
            else {
                var result = [];
                for (var key in mixed_var) {
                    if (result.indexOf(mixed_var[key]))
                        continue;
                    result.push(mixed_var[i]);
                }
                return result;
            }
        } else
            return mixed_var;
    }

    range(start, end, step) {
        let range = [],
            typeofStart = typeof start,
            typeofEnd = typeof end;
        if (step <= 0)
            step = 1;
        if (typeofStart === "undefined" || typeofEnd === "undefined")
            return false;
        else if (typeofStart !== typeofEnd)
            return false;
        typeof step == "undefined" && (step = 1);
        if (end < start)
            step = -step;
        if (typeofStart == "number")
            while (step > 0 ? end >= start : end <= start) {
                range.push(start);
                start += step;
            }
        else if (typeofStart == "string") {
            if (start.length != 1 || end.length != 1)
                return false;
            start = start.charCodeAt(0);
            end = end.charCodeAt(0);
            while (step > 0 ? end >= start : end <= start) {
                range.push(String.fromCharCode(start));
                start += step;
            }
        } else
            return false;
        return range;
    }

    /**
     * @method      first      从指定对象或数组中取出第一个可以遍历的成员
     *
     * @param       {object|array}       obj       指定的对象或数组
     * @return      {abject}                       @example {key: 'key', value: 'value'}
     */
    first(obj) {
        if (typeof(obj) === 'object' && obj !== null) {
            for (let key in obj) return {key: key, value: obj[key]};
        } else
            return false;
    }

    last(obj, n) {
        return _.last(obj, n);
    }

    min(obj) {
        if (typeof(obj) === 'object' && obj !== null) {
            let list = [];
            for (let key in obj)
                list.push(this.tonumber(obj[key], -1));
            return Math.min.apply(Math, list);
        } else
            return false;
    }

    max(obj) {
        if (typeof(obj) === 'object' && obj !== null) {
            let list = [];
            for (let key in obj)
                list.push(this.tonumber(obj[key], -1));
            return Math.max.apply(Math, list);
        } else
            return false;
    }

    implode(glue, pieces) {
        let i = '',
            retVal = '',
            tGlue = '';
        if (arguments.length === 1) {
            pieces = glue;
            glue = '';
        }
        if (typeof pieces === 'object') {
            if (Object.prototype.toString.call(pieces) === '[object Array]')
                return pieces.join(glue);
            for (i in pieces) {
                retVal += tGlue + pieces[i];
                tGlue = glue;
            }
            return retVal;
        }
        return pieces;
    }

    /**
     * @method      count      计算对象或数组的可枚举成员数
     *
     * @param       {object|array}       value          要计算的对象或者数组
     * @return      {int}                               返回value的可枚举成员数
     */
    count(value) {
        let result = 0;
        for (let i in value)
            result++;
        return result;
    }

    /**
     * @method      arraysum      计算对象或数组的所有可枚举成员数的和
     *
     * @param       {object|array}       value          要计算的对象或者数组
     * @return      {int}                               返回总和
     */
    arraysum(value) {
        let result = 0;
        for (let i in value)
            result += value[i];
        return result;
    }

    array_rand(input, num_req) {
        let indexes = [],
            ticks = num_req || 1,
            checkDuplicate = function (input, value) {
                let exist = false,
                    index = 0,
                    il = input.length;
                while (index < il) {
                    if (input[index] === value) {
                        exist = true;
                        break;
                    }
                    index++;
                }
                return exist;
            };

        if (Object.prototype.toString.call(input) === '[object Array]' && ticks <= input.length) {
            while (true) {
                let rand = Math.floor((Math.random() * input.length));
                if (indexes.length === ticks)
                    break;
                if (!checkDuplicate(indexes, rand))
                    indexes.push(rand);
            }
        } else
            indexes = null;
        return ((ticks == 1) ? indexes.join() : indexes);
    }

    mergeobj(obja, objb) {
        let result = {};
        if (this.typeof(obja) === 'array' && this.typeof(objb) === 'array')
            result = [];
        for (let att in obja)
            result[att] = obja[att];
        for (let att in objb)
            result[att] = objb[att];
        return result;
    }

    mergeobj_recursive(obja, objb) {
        let me = this;
        let result = {};
        for (let att in obja) {
            if (objb.hasOwnProperty(att) && typeof (obja[att]) === 'object') {
                result[att] = me.mergeobj(obja[att], objb[att]);
                delete objb[att];
            } else
                result[att] = obja[att];
        }

        for (let att in objb)
            result[att] = objb[att];
        return result;
    }

    array_values(input) {
        let tmp_arr = [];
        if (input && typeof input === 'object' && input.change_key_case)
            return input.values();
        for (let key in input)
            tmp_arr[tmp_arr.length] = input[key];
        return tmp_arr;
    }

    /**
     * @method      inarray      判断指定值是否在指定的数组或者对象之中
     *
     * @param       {*}                 needle          等待检验的值
     * @param       {object|array}      haystack        等待查找的数组或者对象
     * @param       {boolean}           argStrict       是否严格类型判断
     * @return      {boolean}                           返回{boolean}
     */
    inarray(needle, haystack, argStrict) {
        let key = '',
            strict = !!argStrict;
        if (strict) {
            for (key in haystack)
                if (haystack[key] === needle)
                    return true;
        } else {
            for (key in haystack)
                if (haystack[key] == needle)
                    return true;
        }
        return false;
    }

    /**
     * @method      shuffle      打乱列表（只针对自身成员）
     *
     * @param       {object|array}      inputArr     等待打乱的数组或者对象（不修改本身）
     * @return      {array}                          返回打乱后的新数组
     */
    shuffle(inputArr) {
        let valArr = [];

        for (let k in inputArr)
            if (inputArr.hasOwnProperty(k))
                valArr.push(inputArr[k]);
        valArr.sort(function () {
            return 0.5 - Math.random();
        });
        return valArr;
    }

    sha1(str) {
        let rotate_left = function (n, s) {
            return (n << s) | (n >>> (32 - s));
        }, cvt_hex = function (val) {
            let str = '',
                i, v;
            for (i = 7; i >= 0; i--) {
                v = (val >>> (i * 4)) & 0x0f;
                str += v.toString(16);
            }
            return str;
        };

        let blockstart, i, j, W = new Array(80),
            H0 = 0x67452301,
            H1 = 0xEFCDAB89,
            H2 = 0x98BADCFE,
            H3 = 0x10325476,
            H4 = 0xC3D2E1F0,
            A, B, C, D, E, temp;
        str = this.utf8_encode(str);
        let str_len = str.length,
            word_array = [];
        for (i = 0; i < str_len - 3; i += 4) {
            j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
            word_array.push(j);
        }

        switch (str_len % 4) {
            case 0:
                i = 0x080000000;
                break;
            case 1:
                i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
                break;
            case 2:
                i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
                break;
            case 3:
                i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) <<
                    8 | 0x80;
                break;
        }

        word_array.push(i);

        while ((word_array.length % 16) != 14)
            word_array.push(0);

        word_array.push(str_len >>> 29);
        word_array.push((str_len << 3) & 0x0ffffffff);

        for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
            for (i = 0; i < 16; i++)
                W[i] = word_array[blockstart + i];

            for (i = 16; i <= 79; i++)
                W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

            A = H0;
            B = H1;
            C = H2;
            D = H3;
            E = H4;

            for (i = 0; i <= 19; i++) {
                temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 20; i <= 39; i++) {
                temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 40; i <= 59; i++) {
                temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 60; i <= 79; i++) {
                temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            H0 = (H0 + A) & 0x0ffffffff;
            H1 = (H1 + B) & 0x0ffffffff;
            H2 = (H2 + C) & 0x0ffffffff;
            H3 = (H3 + D) & 0x0ffffffff;
            H4 = (H4 + E) & 0x0ffffffff;
        }

        temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
        return temp.toLowerCase();
    }

    md5(str) {
        let xl, rotateLeft = function (lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }, addUnsigned = function (lX, lY) {
            let lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4)
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            if (lX4 | lY4) {
                if (lResult & 0x40000000)
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                else
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            } else
                return (lResult ^ lX8 ^ lY8);
        }, _F = function (x, y, z) {
            return (x & y) | ((~x) & z);
        }, _G = function (x, y, z) {
            return (x & z) | (y & (~z));
        }, _H = function (x, y, z) {
            return (x ^ y ^ z);
        }, _I = function (x, y, z) {
            return (y ^ (x | (~z)));
        }, _FF = function (a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }, _GG = function (a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }, _HH = function (a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }, _II = function (a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }, convertToWordArray = function (str) {
            let lWordCount, lMessageLength = str.length,
                lNumberOfWords_temp1 = lMessageLength + 8,
                lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64,
                lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16,
                lWordArray = new Array(lNumberOfWords - 1),
                lBytePosition = 0,
                lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        }, wordToHex = function (lValue) {
            let wordToHexValue = '',
                wordToHexValue_temp = '',
                lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                wordToHexValue_temp = '0' + lByte.toString(16);
                wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
            }
            return wordToHexValue;
        };

        let x = [],
            k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
            S12 = 12,
            S13 = 17,
            S14 = 22,
            S21 = 5,
            S22 = 9,
            S23 = 14,
            S24 = 20,
            S31 = 4,
            S32 = 11,
            S33 = 16,
            S34 = 23,
            S41 = 6,
            S42 = 10,
            S43 = 15,
            S44 = 21;

        str = this.utf8_encode(str);
        x = convertToWordArray(str);
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;

        xl = x.length;
        for (k = 0; k < xl; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = _FF(a, b, c, d, x[k], S11, 0xD76AA478);
            d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = _GG(b, c, d, a, x[k], S24, 0xE9B6C7AA);
            a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = _HH(d, a, b, c, x[k], S32, 0xEAA127FA);
            c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = _II(a, b, c, d, x[k], S41, 0xF4292244);
            d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = addUnsigned(a, AA);
            b = addUnsigned(b, BB);
            c = addUnsigned(c, CC);
            d = addUnsigned(d, DD);
        }
        let temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
        return temp.toLowerCase();
    }

    utf8_encode(argString) {
        if (argString === null || typeof argString === 'undefined')
            return '';
        let string = (argString + ''),
            utftext = '',
            start, end, stringl = 0;
        start = end = 0;
        stringl = string.length;
        for (let n = 0; n < stringl; n++) {
            let c1 = string.charCodeAt(n),
                enc = null;
            if (c1 < 128)
                end++;
            else if (c1 > 127 && c1 < 2048)
                enc = String.fromCharCode(
                    (c1 >> 6) | 192, (c1 & 63) | 128);
            else if ((c1 & 0xF800) != 0xD800)
                enc = String.fromCharCode(
                    (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
            else {
                if ((c1 & 0xFC00) != 0xD800)
                    return false;
                let c2 = string.charCodeAt(++n);
                if ((c2 & 0xFC00) != 0xDC00)
                    return false;
                c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
                enc = String.fromCharCode(
                    (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
            }
            if (enc !== null) {
                if (end > start)
                    utftext += string.slice(start, end);
                utftext += enc;
                start = end = n + 1;
            }
        }
        if (end > start)
            utftext += string.slice(start, stringl);
        return utftext;
    }

    /**
     * @method      random      获得两个数之间的随机值
     *
     * @param       {boolean}       min          较小值
     * @param       {boolean}       max          较大值
     * @return      {int|false}                  返回较小值与较大值之间的整数值,当min大于max时返回false
     */
    random(min, max) {
        min = this.tonumber(min, 0);
        max = this.tonumber(max, 0);
        if (max === min)
            return max;
        else if (max > min)
            return Math.floor(Math.random() * (max - min + 1)) + min;
        else if (max < min)
            return false;
    }

    get_parameter(args, param) {
        let me = this;
        let result = {}, ended = false;
        if (!me.empty(args)) {
            for (let i in args) {
                if (typeof (args[i]) === 'function') {
                    result.callback = args[i];
                    ended = true;
                } else {
                    if (ended === false)
                        result[param[i]] = args[i];
                    else
                        result[param[i]] = undefined;
                }
            }
        } else {
            for (let i in param)
                result[param[i]] = undefined;
        }
        return result;
    }

    clone(item) {
        if (!item) {
            return item;
        } // null, undefined values check
        let me = this;
        let types = [Number, String, Boolean];
        let result = null;
        types.forEach(function (type) {
            if (item instanceof type) {
                result = item;
            }
        });
        if (result === null) {
            if (me.typeof(item) === "array") {
                result = [];
                item.forEach(function (child, index) {
                    result[index] = me.clone(child);
                });
            } else if (me.typeof(item) === "object") {
                result = new Object();
                for (let i in item) {
                    result[i] = me.clone(item[i]);
                }
            } else if (me.typeof(item) === "map") {
                result = new Map();
                item.forEach(function (val, key) {
                    result.set(key, me.clone(val));
                });
            } else
                result = item;
        }
        return result;
    }

    /**.
     * 从一个数组里取组合(比如求C32，则使用common.array_combination([1,2,3], 2)
     * @param array{array} 原始的数组
     * @param choose{int} 取多少个
     * @param filter{function} 过滤函数，如果有定义则返回组函数过滤后的组合,filter原型: function(arr){return true/false}
     * @returns {Array} 结果,比如[ [1,2],[1,3],[2,3]
     */
    array_combination(array, choose, filter) {
        let composed = [];
        let combinated = [];
        if (typeof filter !== 'function')
            filter = false;

        function array_compose(start, choose) {

            if (choose === 0) {
                if (filter === false || filter(composed))
                    combinated.push(composed.concat());
            }
            else {
                for (var i = start; i <= array.length - choose; i++) {
                    composed.push(array[i]);
                    array_compose(i + 1, choose - 1);
                    composed.pop();
                }
            }
        }

        array_compose(0, choose);
        return combinated;
    }

    /**
     * 统计每个元素出现的次数
     * @param array {array | object} 原始对象
     * @returns {object}
     */
    array_count_values(array) {
        if (!this.isobj(array))
            return false;
        let ret_array = {};
        for (let key in array) {
            let value = this.tostring(array[key]);
            for (let ret_key in ret_array) {
                if (ret_key === value) {
                    ret_array[ret_key]++;
                    break;
                }
            }
            ret_array[value] = ret_array[value] || 1;
        }
        return ret_array;
    }

    //实现php的ksort
    ksort(parameter, iteratee) {
        let paramlist = [];
        for (let i in parameter) {
            paramlist.push({name: i, value: parameter[i]});
        }
        paramlist = _.sortBy(paramlist, iteratee);

        let ret = {};
        for (let i in paramlist)
            ret[paramlist[i].name] = paramlist[i].value;
        return ret;
    }

    //是否包含unicode text
    isunicode(string) {
        return /[\u0080-\uffff]/.test(string);
    }


    toboolean(mixed_var) {
        return this.empty(mixed_var);
    }

    float2fix(data, num) {
        if (!this.isint(num) || num < 0)
            num = 4;
        for (let i in data) {
            if (typeof data[i] === "object")
                this.float2fix(data[i], num);
            else if (this.isfloat(data[i]))
                data[i] = data[i].toFixed(num);
        }
        return data;
    }

    /**
     * @method      typeof      明确诊断参数的具体类型
     *
     * @param       {*}             data           等待体检的值
     * @return      {string}                       返回类型的简单描述
     */
    typeof(data) {
        if (typeof (data) === 'object') {
            switch (Object.prototype.toString.call(data)) {
                case '[object Null]':
                    return 'null';
                case '[object Object]':
                    return 'object';
                case '[object Array]':
                    return 'array';
                case '[object Map]':
                    return 'map';
                case '[object Set]':
                    return 'set';
                case '[object WeakMap]':
                    return 'weakmap';
                case '[object WeakSet]':
                    return 'weakset';
            }
        } else {
            return typeof (data);
        }
    }

    /**
     * @method mosaic  马赛克
     * @param tarstr {string | number}        替换目标字符串
     * @param start  {number}                 起始位置
     * @param length {number}                 替换长度
     * @param (repstr) {string | number}      替换字符
     * @param (adapt)  {boolean}              自适应开关
     * @example
     * mosaic(1234, 1, 2) => '1XX4'
     * mosaic(1234, -5, 2) => 'XX34'
     * mosaic(1234, 1, 2, '*', true) => '1**4'            mosaic(1234, 1, 2, '*', false) => '1**4'
     * mosaic(1234, 1, 6, '*', true) => '1***'            mosaic(1234, 1, 6, '*', false) => '1***'
     * mosaic(1234, 5, 1, '*', true) => '*234'            mosaic(1234, 5, 1, '*', false) => '1234'
     * mosaic(1234, 5, 10, '*', true) => '****'           mosaic(1234, 5, 10, '*', false) => '1234'
     * mosaic(1234, -2, 2, '*', true) => '12**'           mosaic(1234, -2, 2, '*', false) => '12**'
     * mosaic(1234, -1, 2, '*', true) => '123*'           mosaic(1234, -1, 2, '*', false) => '123*'
     * mosaic(1234, -5, 2, '*', true) => '**34'           mosaic(1234, -5, 2, '*', false) => '1234'
     * mosaic(1234, -5, 7, '*', true) => '****'           mosaic(1234, -5, 7, '*', false) => '1234'
     * mosaic(1234, 1, 1, '*|', true) => '1*|34'          mosaic(1234, 1, 1, '*|', false) => '1*|34'
     */
    mosaic(tarstr, start, length, repstr, adapt) {
        repstr = repstr || 'X';
        repstr = typeof(repstr) === 'number' ? repstr.toString() : repstr;
        tarstr = typeof(tarstr) === 'number' ? tarstr.toString() : tarstr;
        adapt = this.typeof(adapt) === 'undefined' ? true : Boolean(adapt);
        start = this.tonumber(start, 0);
        length = this.tonumber(length, 0, true);
        if (typeof(tarstr) !== 'string' || typeof(repstr) !== 'string' || (!adapt && (start > tarstr.length || tarstr.length + start < 0)))
            return tarstr;
        start = start < tarstr.length ? start : 0;
        let index = 0;
        if (start < 0) {
            index = tarstr.length + start;
            index = index < 0 ? 0 : index;
            length = tarstr.length - index > length ? length : tarstr.length - index;
        } else {
            index = start;
            length = start + length + 1 > tarstr.length ? tarstr.length - start : length;
        }
        repstr = repstr.repeat(length);
        return tarstr.substr(0, index) + repstr + tarstr.substr(index + length);
    }

    uniq(arr) {
        if (Array.isArray(arr)) {
            let tmp = new Map();
            for (let i = 0; i < arr.length; i++) {
                tmp.set(arr[i], null);
            }
            return [...tmp.keys()];
        } else {
            return arr;
        }
    }

    isequal(object, other) {
        return _.isEqual(object, other);
    }

    millisecond2date(msd) {
        let time = parseFloat(msd) / 1000;
        if (null != time && "" != time) {
            if (time >= 60 && time < 60 * 60) {
                let second = parseInt(time % 60);
                time = `${parseInt(time / 60)} minute${second > 0 ? ` ${second} second` : ``}`;
            } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                let hour = parseInt(time / 3600);
                let minute = parseInt((time - hour * 3600) / 60.0);
                let second = parseInt(time - hour * 3600 - minute * 60);
                time = `${hour} hour${(minute > 0 || second > 0) ? ` ${minute} minute`: ``}${second > 0 ? ` ${second} second` : ``}`;
            } else {
                time = `${parseInt(time)} second`;
            }
        }
        return time;
    }
}

module.exports = new Common();
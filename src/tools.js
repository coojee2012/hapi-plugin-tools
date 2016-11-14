/**
 * Created by LinYong on 11/3/2015.
 */
import JWT from 'jsonwebtoken';
import SanitizeHtml from 'sanitize-html';

import * as I18N from './i18n';
export class Tools {
    constructor(appLogger) {
        this.logger = appLogger || console.log;
        this.sanitize = SanitizeHtml;
        this.restJson = this.restJson.bind(this);
        this.union = this.union.bind(this);
        this.isArray = this.isArray.bind(this);
        this.each = this.each.bind(this);
        this.sanitizeHtml = this.sanitizeHtml.bind(this);
        this.sanitise = this.sanitise.bind(this);
        this.jwsSign = this.jwsSign.bind(this);
        this.hasOwn = this.hasOwn.bind(this);
        this.noop = this.noop.bind(this);
        this.parseUrl = this.parseUrl.bind(this);
    }

    /*
     @description 标准化返回数据结构
     @param {Object} error -错误信息
     @param {Object} data - 返回的数据对象
     @param {Object} pagination - 返回分页信息
     @param {Object} otherObj - 需要返回的额外信息
     @return {Object}
     */
    restJson(data = {}, code = 0, ttlStart = 0, i18n = 'zh_CN', otherObj = {}) {
        const self = this;

        const lang = I18N[i18n];
        const codeType = self.checkType(code);

        let result = self.union({}, otherObj);
        result.statusCode = 200;
        result.code = code;
        result.message = "";
        result.ttl = Date.now() - ttlStart;
        result.data = data;
        if (codeType === 'number' && code > 0) {
            if (lang && lang.ErrorCode && lang.ErrorCode.hasOwnProperty(String(code))) {
                result.message = lang.ErrorCode[String(code)];
            } else {
                result.message = lang.ErrorCode['80080000'];
            }
            //self.logger(['error', 'Reponse'], result);
        }
        else if (codeType === 'string' || codeType === 'null') {
            result.code = 80081000;
            result.message = code;
        }
        else if (codeType === 'array') {
            result.code = 80081000;
            result.message = code.join(',');
        }
        else if (codeType === 'object') {
            result.code = codeType.code + 0 || 80081000;
            result.message = codeType.message || lang.ErrorCode['80081000'];
        }
        else {
            //self.logger(['info', 'Reponse'], result);
        }

        return result;
    }

    union(a, b) {
        let self = this;
        let type = self.checkType(a);
        if (b === undefined) {
            b = a;
            a = type === 'object' ? {} : [];
        }
        if (type === self.checkType(b)) {
            if (type === 'object' || type === 'array') {
                self.each(b, function (x, i) {
                    let type = self.checkType(x);
                    if (type === 'object' || type === 'array') {
                        a[i] = type === self.checkType(a[i]) ? a[i] : (type === 'object' ? {} : []);
                        self.union(a[i], x);
                    } else {
                        a[i] = type === 'function' ? null : x;
                    }
                });
            } else {
                a = type === 'function' ? null : b;
            }
        }
        return a;
    }

    checkType(obj) {
        let self = this;
        let type = typeof obj;
        if (obj === null) {
            return 'null';
        } else if (self.isArray(obj)) {
            return 'array';
        } else {
            return type;
        }
    }

    isArray(value) {
        return Array.isArray(value);
    }

    /*
     @description 循环处理数组或对象
     @param {Object | Array} obj - 需要处理的数组或对象
     @param {Function} iterator - 迭代处理函数
     @param {String} context - 上下文
     @param {Boolean} arrayLike - 指定处理数组
     @param {Boolean} right - 从右边开始
     */
    each(obj, iterator, context, arrayLike, right) {
        let i, l, key;
        let self = this;
        iterator = iterator || self.noop;
        if (!obj) {
            return;
        } else if (arrayLike || self.isArray(obj)) {
            if (!right) {
                for (i = 0, l = obj.length; i < l; i++) {
                    if (iterator.call(context, obj[i], i, obj) === breaker) {
                        return;
                    }
                }
            } else {
                for (i = obj.length - 1; i >= 0; i--) {
                    if (iterator.call(context, obj[i], i, obj) === breaker) {
                        return;
                    }
                }
            }
        } else {
            for (key in obj) {
                if (self.hasOwn(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === breaker) {
                        return;
                    }
                }
            }
        }
    }

    hasOwn(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }

    noop() {
    }

    sanitise(txt) {
        /* istanbul ignore else */
        if (txt.indexOf("<") > -1 /* istanbul ignore next */
            || txt.indexOf(">") > -1) {
            txt = txt.replace(/</g, "&lt").replace(/>/g, "&gt");
        }
        return txt;
    }

    sanitizeHtml(html, options) {
        let self = this;
        return self.sanitize(html);
    }

    parseUrl(url) {
        const reURLInformation = new RegExp([
            '^(https?:)//', // protocol
            '(([^:/?#]*)(?::([0-9]+))?)', // host (hostname and port)
            '(/?[^?#]*)', // pathname
            '(\\?[^#]*|)', // search
            '(#.*|)$' // hash
        ].join(''));
        return reURLInformation.exec(url);
    };

    jwsSign(payload, cert, options) {
        payload = Object.assign(
            {},
            {
                iat: Math.floor(Date.now() / 1000),
            },
            payload);
        options = Object.assign({}, {
            algorithm: 'RS256',
            expiresIn: 60 * 60,
            issuer: '11366846@qq.com',
            audience: 'audience',
            subject: 'subject',
        }, options);
        return new Promise((resolve, reject) => {
            JWT.sign(payload, cert, options, (err, token) => {
                err ? reject(err) : resolve(token);
            });
        });
    }

}


export default Tools;





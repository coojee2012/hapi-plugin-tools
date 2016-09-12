'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tools = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by LinYong on 11/3/2015.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _sanitizeHtml = require('sanitize-html');

var _sanitizeHtml2 = _interopRequireDefault(_sanitizeHtml);

var _i18n = require('./i18n');

var I18N = _interopRequireWildcard(_i18n);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tools = exports.Tools = function () {
  function Tools(appLogger) {
    _classCallCheck(this, Tools);

    this.logger = appLogger || console.log;
    this.sanitize = _sanitizeHtml2.default;
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


  _createClass(Tools, [{
    key: 'restJson',
    value: function restJson() {
      var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var code = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var ttlStart = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
      var i18n = arguments.length <= 3 || arguments[3] === undefined ? 'zh_CN' : arguments[3];
      var otherObj = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

      var self = this;
      var lang = I18N[i18n];
      var codeType = self.checkType(code);

      var result = self.union({}, otherObj);
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
      } else if (codeType === 'string' || codeType === 'null') {
        result.code = 80081000;
        result.message = code;
      } else if (codeType === 'array') {
        result.code = 80081000;
        result.message = code.join(',');
      } else if (codeType === 'object') {
        result.code = 80081000;
        result.message = codeType.message || lang.ErrorCode['80081000'];
      } else {
        //self.logger(['info', 'Reponse'], result);
      }

      return result;
    }
  }, {
    key: 'union',
    value: function union(a, b) {
      var self = this;
      var type = self.checkType(a);
      if (b === undefined) {
        b = a;
        a = type === 'object' ? {} : [];
      }
      if (type === self.checkType(b)) {
        if (type === 'object' || type === 'array') {
          self.each(b, function (x, i) {
            var type = self.checkType(x);
            if (type === 'object' || type === 'array') {
              a[i] = type === self.checkType(a[i]) ? a[i] : type === 'object' ? {} : [];
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
  }, {
    key: 'checkType',
    value: function checkType(obj) {
      var self = this;
      var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
      if (obj === null) {
        return 'null';
      } else if (self.isArray(obj)) {
        return 'array';
      } else {
        return type;
      }
    }
  }, {
    key: 'isArray',
    value: function isArray(value) {
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

  }, {
    key: 'each',
    value: function each(obj, iterator, context, arrayLike, right) {
      var i = void 0,
          l = void 0,
          key = void 0;
      var self = this;
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
  }, {
    key: 'hasOwn',
    value: function hasOwn(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    }
  }, {
    key: 'noop',
    value: function noop() {}
  }, {
    key: 'sanitise',
    value: function sanitise(txt) {
      /* istanbul ignore else */
      if (txt.indexOf("<") > -1 /* istanbul ignore next */
      || txt.indexOf(">") > -1) {
        txt = txt.replace(/</g, "&lt").replace(/>/g, "&gt");
      }
      return txt;
    }
  }, {
    key: 'sanitizeHtml',
    value: function sanitizeHtml(html, options) {
      var self = this;
      return self.sanitize(html);
    }
  }, {
    key: 'parseUrl',
    value: function parseUrl(url) {
      var reURLInformation = new RegExp(['^(https?:)//', // protocol
      '(([^:/?#]*)(?::([0-9]+))?)', // host (hostname and port)
      '(/?[^?#]*)', // pathname
      '(\\?[^#]*|)', // search
      '(#.*|)$' // hash
      ].join(''));
      return reURLInformation.exec(url);
    }
  }, {
    key: 'jwsSign',
    value: function jwsSign(payload, cert, options) {
      payload = Object.assign({}, {
        iat: Math.floor(Date.now() / 1000)
      }, payload);
      options = Object.assign({}, {
        algorithm: 'RS256',
        expiresIn: 60 * 60,
        issuer: '11366846@qq.com',
        audience: 'audience',
        subject: 'subject'
      }, options);
      return new Promise(function (resolve, reject) {
        _jsonwebtoken2.default.sign(payload, cert, options, function (err, token) {
          err ? reject(err) : resolve(token);
        });
      });
    }
  }]);

  return Tools;
}();

exports.default = Tools;
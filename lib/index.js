'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tools = require('./tools');

var _tools2 = _interopRequireDefault(_tools);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by linyong on 16/5/18.
 */
var ToolsPlugin = function ToolsPlugin(server, options, next) {
  var tools = new _tools2.default();
  server.expose('restJson', tools.restJson);
  server.expose('checkType', tools.checkType);
  server.expose('sanitize', tools.sanitize);
  server.expose('isArray', tools.isArray);
  next();
};
ToolsPlugin.attributes = {
  pkg: _package2.default,
  multiple: true
};

exports.default = ToolsPlugin;
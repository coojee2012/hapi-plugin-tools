/**
 * Created by linyong on 16/5/18.
 */
import Tools from './tools';
import packageJson from '../package.json';

const ToolsPlugin = function (server, options, next) {
  const tools = new Tools();
  server.expose('restJson', tools.restJson);
  server.expose('checkType', tools.checkType);
  server.expose('sanitize', tools.sanitize);
  server.expose('isArray', tools.isArray);
  server.expose('sanitise', tools.sanitise);
  server.expose('jwsSign', tools.jwsSign);
  next();
};
ToolsPlugin.attributes = {
  pkg: packageJson,
  multiple: true,
};

export default ToolsPlugin;

/**
 * Created by linyong on 9/7/16.
 */
import assert from 'assert';
import Tools from '../src/tools';

describe('hapi_plugin_tools', () => {
  const tools = new Tools();
  it('isArray', done => {
    assert.equal(true, tools.isArray([]));
    done()
  });
  it('restJson',done =>{
    const rest = tools.restJson(null,{name:'MongoError'});
    assert.equal(80081000,rest.code);
    done();
  });
});
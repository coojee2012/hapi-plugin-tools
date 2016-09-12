# A tools plugin for hapi

*Just a lib plugin for hapi,content some useful tools ,enjoy it!*

*If you have some useful method push it to me!*

*欢迎加入您觉得有用的方法,谢谢!*

## Install
```
npm install hapi-plugin-tools
```
## Usage
### In your app
```js
import Hapi from 'hapi';
import ToolsPlugin from 'hapi-plugin-tools';
const server = new Hapi.Server();
server.register([
  {
    register: ToolsPlugin,
    options: {},
  }
])

// In some where you use it

server.plugins['hapi-plugin-tools'].['xxxx']
```
### Don't forget
```js
require('babel-polyfill'); // In your main prgrams where should use this module
```

### functions
* restJson - let json reply in a  uniform standard
* checkType - check object type
* isArray -
* sanitize - sanitize html
* parseUrl - parse url for use
* and so on ....wait next

## License

This software is licensed under the Apache 2 license, quoted below.

    Copyright (c) 2016 Yong Lin <11366846@qq.com>

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

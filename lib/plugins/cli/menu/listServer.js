'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const flowSaverServer = appRequire('plugins/flowSaver/server');
const index = appRequire('plugins/cli/index');
const inquirer = require('inquirer');

const menu = [{
  type: 'list',
  name: 'server',
  message: 'Select server:',
  choices: []
}, {
  type: 'list',
  name: 'act',
  message: 'What do you want?',
  choices: ['Switch to it', 'Delete server', 'Edit server']
}];

const editServer = [{
  type: 'input',
  name: 'name',
  message: 'Enter server name:',
  validate: function (value) {
    if (value === '') {
      return 'You can not set an empty name.';
    } else {
      return true;
    }
  }
}, {
  type: 'input',
  name: 'host',
  message: 'Enter server host:',
  validate: function (value) {
    if (value === '') {
      return 'You can not set an empty host.';
    } else {
      return true;
    }
  }
}, {
  type: 'input',
  name: 'port',
  message: 'Enter server port:',
  validate: function (value) {
    if (Number.isNaN(+value)) {
      return 'Please enter a valid port number.';
    } else if (+value <= 0 || +value >= 65536) {
      return 'Port number must between 1 to 65535.';
    } else {
      return true;
    }
  }
}, {
  type: 'input',
  name: 'password',
  message: 'Enter password:',
  validate: function (value) {
    if (value === '') {
      return 'You can not set an empty password.';
    } else {
      return true;
    }
  }
}];

const list = (() => {
  var _ref = _asyncToGenerator(function* () {
    try {
      const listServer = yield flowSaverServer.list();
      menu[0].choices = [];
      listServer.forEach(function (f) {
        const name = f.name + ' ' + f.host + ':' + f.port;
        const value = {
          name: f.name,
          host: f.host,
          port: f.port,
          password: f.password
        };
        menu[0].choices.push({ name, value });
      });
      const selectServer = yield inquirer.prompt(menu);
      if (selectServer.act === 'Switch to it') {
        index.setManagerAddress(selectServer.server.host, selectServer.server.port, selectServer.server.password);
        return;
      } else if (selectServer.act === 'Edit server') {
        editServer[0].default = selectServer.server.name;
        editServer[1].default = selectServer.server.host;
        editServer[2].default = selectServer.server.port;
        editServer[3].default = selectServer.server.password;
        const edit = yield inquirer.prompt(editServer);
        yield flowSaverServer.edit(selectServer.server.name, edit.name, edit.host, edit.port, edit.password);
        return;
      } else if (selectServer.act === 'Delete server') {
        yield flowSaverServer.del(selectServer.server);
        return;
      }
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  });

  return function list() {
    return _ref.apply(this, arguments);
  };
})();

exports.list = list;
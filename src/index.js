require('app-module-path').addPath(__dirname);
var server = require('./server').default;

server.start();
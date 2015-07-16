'use strict';

var app = require('./app'),
	db = require('./db');
	//options = require('./options');

var https = require('https');
var fs = require('fs');

var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

var port = 8080;
var server = https.createServer(options, app).listen(port, function () {
	console.log('HTTPS server patiently listening on port', port);
});

var portUnsecure = 3000;
var serverUnsecure = app.listen(portUnsecure, function (){
	console.log('HTTP server patiently listening on port', portUnsecure);
})

module.exports = {server : server, serverUnsecure : serverUnsecure};
//Configurations
var PORT = 8080;
var DEFAULT_PAGE = "/index.html";

//Setup
var sys = require("sys"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    events = require("events"),
    express = require('express');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('client'));

var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html', 'js', 'css', 'png', 'jpg'],
    index: DEFAULT_PAGE,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
};

exports.start = function (port) {
    PORT = port;
    //Start listening
    var server = http.listen(PORT, function () {

        var host = server.address().address
        var port = server.address().port

        console.log('Server listening at http://%s:%s', host, port)

    });

    exports.app = app;
    exports.server = server;
    exports.io = io;
};

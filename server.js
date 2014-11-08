/* jshint node: true */
"use strict";

var http = require("http"),
    httpProxy = require("http-proxy"),
    connect = require("connect"),
    config = require("config");

module.exports.startServer = function (port, path, callback) {
    var proxy = new httpProxy.RoutingProxy();

    var app = connect()
            .use(connect.favicon())
            .use(connect.logger("dev"))
            .use(connect.static(path))

            .use("/api", function (req, res) {
                proxy.proxyRequest(req, res, config.server);
            })
        ;

    http.createServer(app).listen(port, callback);
};

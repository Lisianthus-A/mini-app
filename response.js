const http = require('http');

const proto = Object.create(http.ServerResponse.prototype);

proto.status = function (code) {
    this.statusCode = code;
    return this;
}

proto.header = function (headers) {
    Object.keys(headers).forEach((field) => {
        this.setHeader(field, headers[field]);
    });
    return this;
}

proto.send = function (data) {
    this.end(data);
}

proto.json = function (obj) {
    this.setHeader('Content-Type', 'application/json');
    this.end(JSON.stringify(obj));
}

module.exports = proto;
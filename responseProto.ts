import * as http from 'http';

interface Proto extends http.ServerResponse {
    status: (code?: number) => Proto;
    header: (headers: Record<string, any>) => Proto;
    send: (data: any) => void;
    json: (obj: Record<string, any>) => void;
}

const proto: Proto = Object.create(http.ServerResponse.prototype);

proto.status = function (code) {
    if (code) {
        this.statusCode = code;
    }
    return this;
}

proto.header = function (headers) {
    Object.entries(headers).forEach(([field, value]) => {
        this.setHeader(field, value);
    });
    return this;
}

proto.send = function (data) {
    if (data && typeof data === 'object') {
        return this.json(data);
    }
    this.end(data);
}

proto.json = function (obj) {
    this.setHeader('Content-Type', 'application/json');
    this.end(JSON.stringify(obj));
}

export default proto;
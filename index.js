const http = require('http');
const resProto = require('./response');
const bodyParser = require('./bodyParser');

// const queryParser = (req) => {
//     const query = {};

//     req.query = query;
// }

// const paramParser = (req) => {
//     const param = {};

//     req.param = param;
// }

class MiniApp {
    constructor() {
        this.server = null;
        this.middlewares = [];
    }

    use(fn) {
        this.middlewares.push(fn);
    }

    get(route, fn) {

    }

    post(route, fn) {

    }

    listen(port, callback) {
        this.server = http.createServer(async (req, res) => {
            Object.setPrototypeOf(res, resProto);            
            let value = undefined;
            for (let i = 0; i < this.middlewares.length; ++i) {
                const middleware = this.middlewares[i];
                value = await new Promise((resolve) => {
                    middleware(req, res, resolve, value);
                }).catch(console.log);
            }
        });

        this.server.listen(port, callback);
    }

    close(callback) {
        this.server && this.server.close(callback);
    }
}

const _export = () => new MiniApp();
_export.bodyParser = bodyParser;
module.exports = _export;
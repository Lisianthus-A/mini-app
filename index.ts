import * as http from 'http';
import responseProto from './responseProto';
import { bodyParser, paramsParser, queryParser } from './utils/index';

export interface wrapReq extends http.IncomingMessage {
    query: Record<string, string>;
    params: Record<string, string>;
    body: Record<string, any>;
}

export type Middleware = (
    req: wrapReq,
    res: typeof responseProto,
    next: (value?: any) => void,
    value: any
) => void;

export type RouterHandler = Omit<Middleware, 'next' | 'value'>;

class MiniApp {
    private server: http.Server | null;
    private middlewares: Middleware[];

    constructor() {
        this.server = null;
        this.middlewares = [bodyParser, paramsParser, queryParser];
    }

    use(fn: Middleware) {
        this.middlewares.push(fn);
    }

    get(route: string, fn: RouterHandler) {

    }

    post(route: string, fn: RouterHandler) {

    }

    listen(port: number, callback?: () => void) {
        this.server = http.createServer(async (req, res) => {
            Object.setPrototypeOf(res, responseProto);
            let value: any = undefined;
            for (let i = 0; i < this.middlewares.length; ++i) {
                const middleware = this.middlewares[i];
                value = await new Promise((resolve) => {
                    // @ts-ignore
                    middleware(req, res, resolve, value);
                }).catch(console.log);
            }
        });

        this.server.listen(port, callback);
    }

    close(callback?: () => void) {
        this.server && this.server.close(callback);
    }
}

export default () => new MiniApp();
import * as http from 'http';
import responseProto from './responseProto';
import { bodyParser, queryParser } from './utils/index';

export interface wrapReq extends http.IncomingMessage {
    query: Record<string, string>;
    params: Record<string, string>;
    body: Record<string, any>;
    bodyBuffer: Buffer;
}

export type wrapRes = typeof responseProto;

export type Middleware = (
    req: wrapReq,
    res: wrapRes,
    next: (value?: any) => void,
    value: any
) => void;

export type RouteHandler = (
    req: wrapReq,
    res: wrapRes
) => void;

export interface Route {
    path: string;
    handler: RouteHandler;
    parts: string[];
}

class MiniApp {
    private server: http.Server | null;
    private middlewares: Middleware[];
    private staticRoutes: Record<string, Route>;
    private dynamicRoutes: Record<string, Route>;

    constructor() {
        this.server = null;
        this.middlewares = [bodyParser, queryParser];

        // { $method_$path: Route }
        this.staticRoutes = {};
        this.dynamicRoutes = {};
    }

    private methodWraper(type: string, path: string, fn: RouteHandler) {
        const isDynamic = /\[[^\/]+\]/.test(path);
        const routeKey = `${type}_${path}`;
        const route = {
            path,
            parts: isDynamic ? path.split('/').filter(item => item) : [],
            handler: fn
        };
        if (isDynamic) {
            this.dynamicRoutes[routeKey] = route;
        } else {
            this.staticRoutes[routeKey] = route;
        }
    }

    use(fn: Middleware) {
        this.middlewares.push(fn);
    }

    get(path: string, fn: RouteHandler) {
        this.methodWraper('GET', path, fn);
    }

    post(path: string, fn: RouteHandler) {
        this.methodWraper('POST', path, fn);
    }

    options(path: string, fn: RouteHandler) {
        this.methodWraper('OPTIONS', path, fn);
    }

    put(path: string, fn: RouteHandler) {
        this.methodWraper('PUT', path, fn);
    }

    delete(path: string, fn: RouteHandler) {
        this.methodWraper('DELETE', path, fn);
    }

    listen(port: number, callback?: () => void) {
        this.server = http.createServer(async (req, res) => {
            // set response prototype
            Object.setPrototypeOf(res, responseProto);

            const method = req.method || 'GET';
            const url = req.url || '';
            const path = decodeURI(url.match(/[^?&]+/)?.[0] || '');
            const routeKey = `${method}_${path}`;
            let routeHandler: RouteHandler | null = null;
            (req as wrapReq).params = {};

            // match static route
            const staticRoute = this.staticRoutes[routeKey];
            if (staticRoute) {
                routeHandler = staticRoute.handler;
            } else {
                // match dynamic route
                for (const key in this.dynamicRoutes) {
                    const routeMethod = key.split('_')[0];
                    const { handler, parts: routeParts } = this.dynamicRoutes[key];
                    const parts = path.split('/').filter(item => item);

                    if (method !== routeMethod || parts.length !== routeParts.length) {
                        continue;
                    }

                    const params: Record<string, string> = {};
                    let paramNotMatch = false;
                    for (let i = 0; i < parts.length; ++i) {
                        const isParam = routeParts[i][0] === '[' && routeParts[i].slice(-1)[0] === ']';
                        if (isParam) {
                            const field = routeParts[i].slice(1, -1);
                            params[field] = parts[i];
                        } else if (parts[i] !== routeParts[i]) {
                            paramNotMatch = true;
                            break;
                        }
                    }

                    if (paramNotMatch) {
                        continue;
                    }

                    (req as wrapReq).params = params;
                    routeHandler = handler;
                    break;
                }
            }

            // match * route
            const key = `${method}_*`;
            if (routeHandler === null && this.staticRoutes[key]) {
                routeHandler = this.staticRoutes[key].handler;
            }

            let value: any;
            // run middlewares
            for (let i = 0; i < this.middlewares.length; ++i) {
                const middleware = this.middlewares[i];
                value = await new Promise((resolve) => {
                    // @ts-ignore
                    middleware(req, res, resolve, value);
                }).catch(console.log);
            }

            if (routeHandler) {
                try {
                    routeHandler(req as wrapReq, res as wrapRes);
                } catch (e) {
                    console.log(e);
                }
            } else {
                // 404
                (res as wrapRes).status(404).end('404');
            }
        });

        this.server.listen(port, callback);
    }

    close(callback?: () => void) {
        this.server && this.server.close(callback);
    }
}

export default () => new MiniApp();
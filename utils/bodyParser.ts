import type { Middleware } from '../application';

const jsonParse = (str: any) => {
    try {
        const json = JSON.parse(str);
        return json;
    } catch (e) {
        return {};
    }
};

const bodyParser: Middleware = (req, res, next) => {
    const contentType = req.headers['content-type'];
    if (contentType !== 'application/json') {
        req.body = {};
        return next();
    }

    const data: any[] = [];
    req.on('data', (chunk) => {
        data.push(chunk);
    });
    req.on('end', () => {
        const buffer = Buffer.concat(data);
        const body = jsonParse(buffer);
        req.body = body;
        next();
    });
    req.on('error', (e) => {
        console.error(e);
        next();
    });
};

export default bodyParser;
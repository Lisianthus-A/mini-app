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
    const data: any[] = [];
    req.on('data', (chunk) => {
        data.push(chunk);
    });
    req.on('end', () => {
        const buffer = Buffer.concat(data);
        const body = jsonParse(buffer);
        req.body = body;
        req.bodyBuffer = buffer;
        next();
    });
    req.on('error', (e) => {
        console.error(e);
        next();
    });
};

export default bodyParser;

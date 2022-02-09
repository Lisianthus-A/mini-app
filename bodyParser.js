const jsonParse = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        console.error(e);
        return {};
    }
};

module.exports = (req, res, next) => {
    const contentType = req.headers['content-type'];
    if (contentType !== 'application/json') {
        req.body = {};
        return next();
    }

    const data = [];
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
}
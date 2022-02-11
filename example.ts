import miniApp from './index';

const app = miniApp();

const PORT = 80;

app.use((req, res, next) => {
    // json body
    console.info('body', req.body);
    // query
    console.info('query', req.query);
    // 动态路由的参数
    console.info('params', req.params);
    next("aaa");
});

app.use((req, res, next, value) => {
    console.info(value); // "aaa"
    next();
});

// 静态路由
app.get('/json', (req, res) => {
    res.status(200).json({
        message: "Hello World"
    });
});

// 动态路由
app.get('/user/[id]', (req, res) => {
    res.send(`userId: ${req.params.id}`);
});

// 匹配所有路由
app.get('*', (req, res) => {
    res.send("*******");
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
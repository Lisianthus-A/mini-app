// const app = miniApp({
//     gzip: true,
//     cors: true
// });

// app.use((req, res, next) => {
//     // json body
//     console.info('body', req.body);
//     // query
//     console.info('query', req.query);
//     // 动态路由的参数
//     console.info('param', req.param);
//     next("aaa");
// });

// app.use((req, res, next, value) => {
//     console.info(value); // "aaa"
//     next();
// });

// // 静态路由
// app.get('/json', (req, res) => {
//     req.status(200).json({
//         message: "Hello World"
//     });
// });

// // 动态路由
// app.get('/user/[id]', (req, res) => {
//     req.send(`userId: ${req.param.id}`);
// });

// // 匹配所有路由
// app.get('*', (req, res) => {
//     req.send("Hello World!");
// });

// app.listen(3000, () => {
//     console.log('listening on port 3000');
// });

const PORT = 80;

const miniApp = require('./index');

const app = miniApp();

app.use(miniApp.bodyParser);

app.use((req, res, next, value) => {
    console.info('body', req.body);
    res.json({ message: "Hello World!" });
});


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
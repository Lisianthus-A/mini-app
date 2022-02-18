## MiniApp
A mini node.js framework, have no dependencies.

### Installation
```
$ npm install @lisianthus-a/mini-app
```

### Usage
``` js
const miniApp = require('@lisianthus-a/mini-app');

const app = miniApp();

const PORT = 80;

app.use((req, res, next) => {
    // json body
    console.log('body', req.body);
    // query
    console.log('query', req.query);
    // dynamic route params
    console.log('params', req.params);
    next("middleware 1");
});

app.use((req, res, next, value) => {
  console.log(value); // "middleware 1"
  next();
});

// static route
app.post('/', (req, res) => {
    res.status(200).json({
        message: "Hello World!"
    });
});

// dynamic route
app.get('/user/[id]', (req, res) => {
    res.json({
        userId: `${req.params.id}`
    });
});

// match any route
app.get('*', (req, res) => {
    res.send("Hello World!");
});

// listen
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
```
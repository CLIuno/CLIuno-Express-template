const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const helmet = require('helmet');
app.use(helmet());

// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');
const ranksRouter = require('./routes/ranks');
const votesRouter = require('./routes/votes');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/ranks', ranksRouter);
app.use('/api/votes', votesRouter);

// custom 404
app.use((req, res, next) => {
    res.status(404).send("Page not found 404!");
});

// custom error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('its the Server fault 500!');
});

app.disable('x-powered-by');
module.exports = app;
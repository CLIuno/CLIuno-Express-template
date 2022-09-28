const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const helmet = require('helmet');
app.use(helmet());

// configs
require("./config/db");
require("reflect-metadata");
require("dotenv").config();

// view engine setup
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

// define routers
const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/api/users');
const postsRouter = require('./src/routes/api/posts');
const ranksRouter = require('./src/routes/api/ranks');
const votesRouter = require('./src/routes/api/votes');
const authRouter = require('./src/routes/auth');

// routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
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
    console.error(err.stack);
    res.status(500).send('it\'s the Server fault 500!');
});

app.disable('x-powered-by');
module.exports = app;
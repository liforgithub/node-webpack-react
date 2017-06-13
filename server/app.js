"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger_1 = require("./util/logger");
const routes_1 = require("./routes");
const app = express();
logger_1.default.info("app开始启动...");
logger_1.default.info("当前环境", process.env.NODE_ENV);
logger_1.default.info("当前端口", process.env.PORT);
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, '../client/WEB-INF/html'));
app.set('view engine', '.html');
app.engine('.html', require('ejs').__express);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(morgan('dev'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../client/static')));
app.use(routes_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
//# sourceMappingURL=app.js.map
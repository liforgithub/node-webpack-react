"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * logger
 * @authors 李雪洋
 * @date    2017/5/5 11:58
 * @version 1.0
 */
const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const fs = require("fs");
const path = require("path");
const config_1 = require("../config");
// ensure LOG_DEST is exist
const logDir = config_1.default.LOG_DIR;
fs.existsSync(logDir) || fs.mkdirSync(logDir);
const tsFormat = () => (new Date()).toLocaleTimeString(); //or toString
let logger = new (winston.Logger)({
    exitOnError: false,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            humanReadableUnhandledException: true,
            timestamp: tsFormat
        }),
        new DailyRotateFile({
            name: 'log.info',
            level: 'info',
            datePattern: 'yyyy-MM-dd',
            filename: path.join(logDir, 'info.log'),
            handleExceptions: true,
            json: false,
            prepend: true,
            timestamp: tsFormat
        }),
        new DailyRotateFile({
            name: 'log.error',
            level: 'error',
            datePattern: 'yyyy-MM-dd',
            filename: path.join(logDir, 'error.log'),
            handleExceptions: true,
            json: false,
            prepend: true,
            timestamp: tsFormat
        })
    ]
});
logger.stream = {
    write: (message, encoding) => logger.info(message)
};
exports.default = logger;
//# sourceMappingURL=logger.js.map
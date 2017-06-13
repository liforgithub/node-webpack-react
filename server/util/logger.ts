/**
 * logger
 * @authors 李雪洋
 * @date    2017/5/5 11:58
 * @version 1.0
 */
import * as winston from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";
import * as fs from "fs";
import * as path from "path";

import CONFIG from "../config";

// ensure LOG_DEST is exist
const logDir = CONFIG.LOG_DIR;
fs.existsSync(logDir) || fs.mkdirSync(logDir);

const tsFormat = () => (new Date()).toLocaleTimeString(); //or toString
let logger: any = new (winston.Logger)({
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
export default logger;

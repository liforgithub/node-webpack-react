/**
 * Created by lixueyang on 2017/5/5.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs_extra_1 = require("fs-extra");
const CONFIG_DIR = process.env.CONFIG_DIR || __dirname;
let CONFIG = fs_extra_1.readJSONSync(path.resolve(CONFIG_DIR, "config.json"));
CONFIG.UPLOAD_DIR = path.resolve(__dirname, '../../temp'); // 上传媒体文件目录
CONFIG.LOG_DIR = process.env.LOG_DIR || path.resolve(__dirname, '../../logs'); // 日志目录
console.log("当前环境配置::", CONFIG);
exports.default = CONFIG;
//# sourceMappingURL=index.js.map
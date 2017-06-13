"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by 李雪洋 on 2017/5/9.
 */
const mysql = require("mysql");
class Pool {
    static mysqlPool() { return mysql.createPool(Pool.config); }
}
Pool.config = {
    host: '172.21.4.155',
    user: 'ehome',
    password: 'root',
    database: 'test',
    port: 3306
};
exports.default = Pool;
//# sourceMappingURL=DBConfig.js.map
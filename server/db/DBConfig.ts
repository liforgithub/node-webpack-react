/**
 * Created by 李雪洋 on 2017/5/9.
 */
import * as mysql from 'mysql';

export default class Pool {

    static config = {
        host: '172.21.4.155',
        user: 'ehome',
        password: 'root',
        database: 'test',
        port: 3306
    };

    static mysqlPool() { return mysql.createPool(Pool.config); }
}

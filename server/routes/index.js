"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controller/user/UserController");
const TaskManagerController_1 = require("../controller/TaskManagerController");
const TplInfoController_1 = require("../controller/TplInfoController");
const router = express_1.Router();
// api请求允许跨域 | Authorization 验证
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS')
        return res.status(200).end(); //加快响应速度
    next();
});
router.get('/', (req, res, next) => res.render('login', { title: 'Express' }));
router.post('/login', UserController_1.default.loginCheck);
/* GET maintainInfo page. */
router.get('/main', (req, res, next) => res.render('main', { title: '主页' }));
router.post('/queryList', TaskManagerController_1.default.queryList);
router.post('/saveTask', TaskManagerController_1.default.saveData);
router.post('/deleteTask', TaskManagerController_1.default.deleteTask);
router.get('/queryUserList', TaskManagerController_1.default.queryUserList);
router.post('/queryTplInfoList', TplInfoController_1.default.queryList);
router.post('/saveTplInfo', TplInfoController_1.default.saveData);
exports.default = router;
//# sourceMappingURL=index.js.map
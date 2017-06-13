import {Router} from "express";

import UserController from "../controller/user/UserController"
import TaskManagerController from "../controller/TaskManagerController"
import TplInfoController from "../controller/TplInfoController";

const router = Router();

// api请求允许跨域 | Authorization 验证
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end(); //加快响应速度
  next();
});

router.get('/', (req, res, next) => res.render('login', { title: 'Express' }));
router.post('/login', UserController.loginCheck);

/* GET maintainInfo page. */
router.get('/main', (req, res, next) => res.render('main', { title: '主页' }));
router.post('/queryList', TaskManagerController.queryList);
router.post('/saveTask', TaskManagerController.saveData);
router.post('/deleteTask', TaskManagerController.deleteTask);
router.get('/queryUserList', TaskManagerController.queryUserList);
router.post('/queryTplInfoList', TplInfoController.queryList);
router.post('/saveTplInfo', TplInfoController.saveData);

export default router;

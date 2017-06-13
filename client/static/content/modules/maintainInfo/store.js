/**
 * Created by 李雪洋 on 2017/5/11.
 */
import React from "react";
import Immutable from "immutable";
import {msg as Messages, Store as store} from "iflux";
import Request from "util/ajax/request";
import CommonInfo from "../../util/CommonInfo";

let appStore = store({
    chooseTab: "MaintainInfo",
    chooseForm: {
        tpl_id: "",
        cx_or_cz: 0,
        create_name: "",
        state: 0,
        tpl_name: "",
        hf_or_sdm: 0,
        execute_name: "",
        create_time : "",
    },
    taskData: {
        dataList: Immutable.fromJS([]),
        totalCount: 0,
        pageNum: 1,
        pageSize: 5
    },
    userList: [],

    flow_id: "",
    tpl_id: "",
    tpl_name: "",
    wy_or_jk: 1, //外挂类型 1,网页  2,接口 3,空充
    task_type: 1,  //任务类型 1,维护  2,开发
    cx_or_cz: 1, //查询充值类别, 1.查询  2,充值
    hf_or_sdm: 1, //话费或水电煤，1,话费, 2,水电煤
    kzcz_type: 0, //空充类型 1,短信, 2,拨号, 3,STK
    create_time: "", //添加时间
    create_name: "", //添加人
    execute_name: "", //执行人
    state: 0, //进度，1,处理中，2,已完成，3,已废弃 4,未分配, 5,已分配
    task_content: "",

    chooseTabType: "text", //text 文字   pic 图片
});
export default appStore;

Messages.on('Home:queryList', () => {
    Request.post('/queryList', {
        tpl_id: appStore.data().getIn(['chooseForm','tpl_id']),
        cx_or_cz: appStore.data().getIn(['chooseForm','cx_or_cz']),
        create_name: appStore.data().getIn(['chooseForm','create_name']),
        state: appStore.data().getIn(['chooseForm','state']),
        tpl_name: appStore.data().getIn(['chooseForm','tpl_name']),
        hf_or_sdm: appStore.data().getIn(['chooseForm','hf_or_sdm']),
        execute_name: appStore.data().getIn(['chooseForm','execute_name']),
        create_time : appStore.data().getIn(['chooseForm','create_time']),
        pageNum: appStore.data().getIn(['taskData','pageNum']) - 1,
        pageSize: appStore.data().getIn(['taskData','pageSize']),
    }).then(res => {
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['taskData','totalCount'], res.totalCount);
            cursor.setIn(['taskData','dataList'], Immutable.fromJS(res.aData));
        });
    });
});

Messages.on('Home:queryUserList', () => {
    Request.get('/queryUserList').then(res => {
        appStore.cursor().withMutations(cursor => {
            cursor.set('userList', res);
        });
    });
});

Messages.on('Home:saveTask', () => {
    Request.post('/saveTask', {
        flow_id: appStore.data().get('flow_id'),
        tpl_id: appStore.data().get('tpl_id'),
        tpl_name: appStore.data().get('tpl_name'),
        wy_or_jk: appStore.data().get('wy_or_jk'),
        task_type: appStore.data().get('task_type'),
        cx_or_cz: appStore.data().get('cx_or_cz'),
        hf_or_sdm: appStore.data().get('hf_or_sdm'),
        kzcz_type: appStore.data().get('kzcz_type'),
        execute_name: appStore.data().get('execute_name'),
        opt_name: CommonInfo.getUserInfo().nickName,
        create_name: appStore.data().get('flow_id') == "" ? CommonInfo.getUserInfo().nickName : appStore.data().get('create_name'),
        state: appStore.data().get('state'),
        task_content: appStore.data().get("task_content"),
    }).then(res => {
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['chooseForm', 'tpl_id'], "");
            cursor.setIn(['chooseForm', 'cx_or_cz'], 0);
            cursor.setIn(['chooseForm', 'create_name'], "");
            cursor.setIn(['chooseForm', 'state'], 0);
            cursor.setIn(['chooseForm', 'tpl_name'], "");
            cursor.setIn(['chooseForm', 'hf_or_sdm'], 0);
            cursor.setIn(['chooseForm', 'execute_name'], "");
            cursor.setIn(['chooseForm', 'create_time'], "");
            cursor.setIn(['taskData', 'pageNum'], 1);
            cursor.setIn(['taskData', 'pageSize'], 5);
        });
        initDialg();
        Messages.emit('Home:queryList');
    });
});

Messages.on("Home:deleteTask", () => {
    Request.post('/deleteTask', {
        flow_id: appStore.data().get("flow_id"),
    }).then(res => {
        initDialg();
        Messages.emit('Home:queryList');
    });
});

function initDialg() {
    appStore.cursor().withMutations(cursor => {
        cursor.set('flow_id', '');
        cursor.set('tpl_id', '');
        cursor.set('tpl_name', '');
        cursor.set('task_type', 1);
        cursor.set('wy_or_jk', 1);
        cursor.set('cx_or_cz', 1);
        cursor.set('hf_or_sdm', 1);
        cursor.set('kzcz_type', 0);
        cursor.set('create_name', 0);
        cursor.set('state', 0);
        cursor.set('task_content', '');
    });
}

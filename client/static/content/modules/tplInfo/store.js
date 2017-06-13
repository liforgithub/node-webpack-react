/**
 * Created by 李雪洋 on 2017/5/19.
 */
import React from "react";
import Immutable from "immutable";
import {msg as Messages, Store as store} from "iflux";
import Request from "util/ajax/request";
import CommonInfo from "../../util/CommonInfo";

let appStore = store({
    chooseTab: "TplInfo",
    chooseForm: {
        tpl_id: "",
        cx_or_cz: 0,
        tpl_name: "",
        hf_or_sdm: 0,
        execute_name: "",
        link: "",
    },
    tplData: {
        dataList: Immutable.fromJS([]),
        totalCount: 0,
        pageNum: 1,
        pageSize: 5
    },
    userList: [],

    flow_id: "",
    tpl_id: "",
    tpl_name: "",
    wy_or_jk: 1, //外挂类型 1,网页  2,接口, 3,空充
    cx_or_cz: 1, //查询充值类别, 1.查询  2,充值
    hf_or_sdm: 1, //话费或水电煤，1,话费, 2,水电煤
    kzcz_type: 0, //空充类型: 1.短信， 2，拨号 3，STK
    execute_name: "", //执行人
    link: "",
    tpl_content: "",

    chooseTabType: "text", //text 文字   pic 图片
});
export default appStore;

Messages.on('TplInfo:queryList', () => {
    Request.post('/queryTplInfoList', {
        tpl_id: appStore.data().getIn(['chooseForm','tpl_id']),
        cx_or_cz: appStore.data().getIn(['chooseForm','cx_or_cz']),
        tpl_name: appStore.data().getIn(['chooseForm','tpl_name']),
        hf_or_sdm: appStore.data().getIn(['chooseForm','hf_or_sdm']),
        execute_name: appStore.data().getIn(['chooseForm','execute_name']),
        pageNum: appStore.data().getIn(['tplData','pageNum']) - 1,
        pageSize: appStore.data().getIn(['tplData','pageSize']),
    }).then(res => {
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['tplData','totalCount'], res.totalCount);
            cursor.setIn(['tplData','dataList'], Immutable.fromJS(res.aData));
        });
    });
});

Messages.on('TplInfo:queryUserList', () => {
    Request.get('/queryUserList').then(res => {
        appStore.cursor().withMutations(cursor => {
            cursor.set('userList', res);
        });
    });
});

Messages.on('TplInfo:saveTask', () => {
    Request.post('/saveTplInfo', {
        flow_id: appStore.data().get('flow_id'),
        tpl_id: appStore.data().get('tpl_id'),
        tpl_name: appStore.data().get('tpl_name'),
        wy_or_jk: appStore.data().get('wy_or_jk'),
        cx_or_cz: appStore.data().get('cx_or_cz'),
        hf_or_sdm: appStore.data().get('hf_or_sdm'),
        kzcz_type: appStore.data().get('kzcz_type'),
        create_name: CommonInfo.getUserInfo().nickName,
        execute_name: appStore.data().get('execute_name'),
        tpl_content: appStore.data().get("tpl_content"),
        link: appStore.data().get("link"),
    }).then(res => {
        appStore.cursor().withMutations(cursor => {
            cursor.setIn(['chooseForm', 'tpl_id'], "");
            cursor.setIn(['chooseForm', 'cx_or_cz'], 0);
            cursor.setIn(['chooseForm', 'tpl_name'], "");
            cursor.setIn(['chooseForm', 'hf_or_sdm'], 0);
            cursor.setIn(['chooseForm', 'execute_name'], "");
            cursor.setIn(['tplData', 'pageNum'], 1);
            cursor.setIn(['tplData', 'pageSize'], 5);
        });
        initDialg();
        Messages.emit('TplInfo:queryList');
    });
});

function initDialg() {
    appStore.cursor().withMutations(cursor => {
        cursor.set('flow_id', '');
        cursor.set('tpl_id', '');
        cursor.set('tpl_name', '');
        cursor.set('wy_or_jk', 1);
        cursor.set('cx_or_cz', 1);
        cursor.set('hf_or_sdm', 1);
        cursor.set('kzcz_type', 0);
        cursor.set('tpl_content', '');
    });
}

/**
 * Created with 李雪洋.
 * 2017-05-05
 */
import React from "react";
import Immutable from "immutable";
import {msg as Messages, Store as store} from "iflux";
import Request from "util/ajax/request";
import tip from "../../common/tip";

/**
 * 数据集合；
 */
let appStore = store({
    userName: "输入ID或用户名登录",
    password: "",
});

Messages.on("Home:Login", () => {

    if (appStore.data().get("userName") == ""
        || appStore.data().get("userName") == null
        || appStore.data().get("password") == ""
        || appStore.data().get("password") == null) {

        tip("账号密码不能为空");
        return;
    }

    Request.post('/login', {
        userName: appStore.data().get("userName"),
        password: $.md5(appStore.data().get("password"))
    }).then(res => {
        let hostName = window.location.hostname;
        $.cookie(hostName + 'userInfo', JSON.stringify(res), {path:"/"});
        window.open('/main', "_self");
    }).fail(err => {
        tip("账号密码错误");
    });
});

export default appStore;
/**
 * Created by 李雪洋 on 2017/5/13.
 */

let CommonInfo = () => {};

//{"userName":"of1727","nickName":"李雪洋","authority":1}
CommonInfo.getUserInfo = () => {
    const host = window.location.hostname;
    return $.parseJSON($.cookie(host + 'userInfo'));
};

module.exports = CommonInfo;
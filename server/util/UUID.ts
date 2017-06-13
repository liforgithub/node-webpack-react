/**
 * Created by 李雪洋 on 2017/5/15.
 */

export default class UUID {

    static S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }

    static getUUID() {
        return (UUID.S4() + UUID.S4() + "-" + UUID.S4() + "-" + UUID.S4() + "-" + UUID.S4() + "-" + UUID.S4() + UUID.S4() + UUID.S4());
    }
}



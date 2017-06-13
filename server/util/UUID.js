/**
 * Created by 李雪洋 on 2017/5/15.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UUID {
    static S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    static getUUID() {
        return (UUID.S4() + UUID.S4() + "-" + UUID.S4() + "-" + UUID.S4() + "-" + UUID.S4() + "-" + UUID.S4() + UUID.S4() + UUID.S4());
    }
}
exports.default = UUID;
//# sourceMappingURL=UUID.js.map
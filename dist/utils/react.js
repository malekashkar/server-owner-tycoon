"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function react(msg, reactions) {
    var _a;
    for (let i = 0; i < reactions.length; i++) {
        try {
            if ((_a = (await msg.fetch())) === null || _a === void 0 ? void 0 : _a.deleted)
                break;
            await msg.react(reactions[i]);
        }
        catch (ignore) { }
    }
}
exports.default = react;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function react(msg, reactions) {
    for (const r of reactions) {
        try {
            if (!msg.deleted)
                await msg.react(r).catch();
        }
        catch (i) { }
    }
}
exports.default = react;

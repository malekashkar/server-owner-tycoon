"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(client) {
        this.isSubCommand = false;
        this.disabled = false;
        this.client = client;
    }
}
exports.default = Command;

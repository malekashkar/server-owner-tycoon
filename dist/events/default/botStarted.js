"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../utils/logger"));
const __1 = __importDefault(require(".."));
class botStarted extends __1.default {
    constructor() {
        super(...arguments);
        this.name = "ready";
    }
    async handle(client) {
        logger_1.default.info(`BOT`, `The bot "${client.user.username}" has started successfully.`);
        for (let i = 0; i < client.guilds.cache.size; i++) {
            const guild = client.guilds.cache.array()[i];
            client.invites.set(guild.id, await guild.fetchInvites());
        }
    }
}
exports.default = botStarted;

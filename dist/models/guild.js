"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
class GuessTheNumber {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Date)
], GuessTheNumber.prototype, "lastTime", void 0);
class ReactionMessage {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Date)
], ReactionMessage.prototype, "lastTime", void 0);
class WordUnscrambler {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Date)
], WordUnscrambler.prototype, "lastTime", void 0);
class Games {
}
__decorate([
    typegoose_1.prop({ default: {} }),
    __metadata("design:type", GuessTheNumber)
], Games.prototype, "guessTheNumber", void 0);
__decorate([
    typegoose_1.prop({ default: {} }),
    __metadata("design:type", ReactionMessage)
], Games.prototype, "reactionMessage", void 0);
__decorate([
    typegoose_1.prop({ default: {} }),
    __metadata("design:type", WordUnscrambler)
], Games.prototype, "wordUnscrambler", void 0);
class Messages {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Messages.prototype, "reactionRoles", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Messages.prototype, "ticketPanel", void 0);
class DbGuild {
}
__decorate([
    typegoose_1.prop({ unique: true }),
    __metadata("design:type", String)
], DbGuild.prototype, "guildId", void 0);
__decorate([
    typegoose_1.prop({ default: "!" }),
    __metadata("design:type", String)
], DbGuild.prototype, "prefix", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], DbGuild.prototype, "joinCategory", void 0);
__decorate([
    typegoose_1.prop({ default: {} }),
    __metadata("design:type", Games)
], DbGuild.prototype, "games", void 0);
__decorate([
    typegoose_1.prop({ default: {} }),
    __metadata("design:type", Messages)
], DbGuild.prototype, "messages", void 0);
__decorate([
    typegoose_1.prop({ default: true }),
    __metadata("design:type", Boolean)
], DbGuild.prototype, "giveaways", void 0);
__decorate([
    typegoose_1.prop({ default: 1 }),
    __metadata("design:type", Number)
], DbGuild.prototype, "giveawayPrize", void 0);
exports.default = DbGuild;
exports.GuildModel = typegoose_1.getModelForClass(DbGuild, {
    schemaOptions: { collection: "guilds" },
});

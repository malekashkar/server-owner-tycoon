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
exports.UserModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
class ReactionRolesUsed {
}
__decorate([
    typegoose_1.prop({ default: false }),
    __metadata("design:type", Boolean)
], ReactionRolesUsed.prototype, "announcements", void 0);
__decorate([
    typegoose_1.prop({ default: false }),
    __metadata("design:type", Boolean)
], ReactionRolesUsed.prototype, "updates", void 0);
__decorate([
    typegoose_1.prop({ default: false }),
    __metadata("design:type", Boolean)
], ReactionRolesUsed.prototype, "polls", void 0);
__decorate([
    typegoose_1.prop({ default: false }),
    __metadata("design:type", Boolean)
], ReactionRolesUsed.prototype, "giveaways", void 0);
class GameCooldowns {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Date)
], GameCooldowns.prototype, "randomMessageReaction", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Date)
], GameCooldowns.prototype, "joinVoiceChannel", void 0);
__decorate([
    typegoose_1.prop({ default: {} }),
    __metadata("design:type", ReactionRolesUsed)
], GameCooldowns.prototype, "reactionRoles", void 0);
class Milestones {
}
__decorate([
    typegoose_1.prop({ default: false }),
    __metadata("design:type", Boolean)
], Milestones.prototype, "week", void 0);
__decorate([
    typegoose_1.prop({ default: false }),
    __metadata("design:type", Boolean)
], Milestones.prototype, "month", void 0);
__decorate([
    typegoose_1.prop({ default: false }),
    __metadata("design:type", Boolean)
], Milestones.prototype, "year", void 0);
class DbUser {
}
__decorate([
    typegoose_1.prop({ unique: true }),
    __metadata("design:type", String)
], DbUser.prototype, "userId", void 0);
__decorate([
    typegoose_1.prop({ default: 0 }),
    __metadata("design:type", Number)
], DbUser.prototype, "points", void 0);
__decorate([
    typegoose_1.prop({ default: {} }),
    __metadata("design:type", GameCooldowns)
], DbUser.prototype, "gameCooldowns", void 0);
__decorate([
    typegoose_1.prop({ default: {} }),
    __metadata("design:type", Milestones)
], DbUser.prototype, "milestones", void 0);
exports.default = DbUser;
exports.UserModel = typegoose_1.getModelForClass(DbUser, {
    schemaOptions: { collection: "User" },
});

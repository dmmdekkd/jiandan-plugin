import plugin from "../../../lib/plugins/plugin.js";

export class GroupManager extends plugin {
    constructor() {
        super({
            name: "群管理插件",
            dsc: "提供完整的群管理功能，支持禁言、踢人、设置管理员等",
            event: "message",
            priority: 50,
            rule: [
                { reg: "^#?(开启|关闭)全员禁言$", fnc: "muteAll" },
                { reg: "^#禁言( \\d+)?( \\d+)?$", fnc: "muteMember" },
                { reg: "^#解除禁言( \\d+)?$", fnc: "unmuteMember" },
                { reg: "^#踢人( \\d+)?$", fnc: "kickMember" },
                { reg: "^#设置管理员 (\\d+)$", fnc: "setAdmin" },
                { reg: "^#取消管理员 (\\d+)$", fnc: "unsetAdmin" },
                { reg: "^#设置群名 (.+)$", fnc: "setGroupName" },
                { reg: "^#设置名片( \\d+)? (.+)$", fnc: "setGroupCard" },
                { reg: "^#群信息$", fnc: "getGroupInfo" },
                { reg: "^#成员信息( \\d+)?$", fnc: "getMemberInfo" },
                { reg: "^#获取成员列表$", fnc: "getMemberList" },
                { reg: "^#戳一戳( \\d+)?$", fnc: "pokeMember" },
            ],
        });
    }

    /** 获取 @ 的 QQ 号 */
    getAtQQ(e) {
        for (let msg of e.message) {
            if (msg.type === "at") {
                return msg.qq;
            }
        }
        return null;
    }

    /** 检查是否为管理员或群主 */
    isAdminOrOwner(e) {
        return e.member && (e.member.is_admin || e.member.is_owner);
    }

    /** 处理全员禁言 */
    async muteAll(e) {
        if (!e.isMaster && !this.isAdminOrOwner(e)) return e.reply("你没有权限噢");
        let status = e.msg.includes("开启");
        await e.group.muteAll(status);
        e.reply(`🔇 全员禁言已${status ? "开启" : "关闭"}`);
    }

    /** 处理禁言成员 */
    async muteMember(e) {
        if (!e.isMaster && !this.isAdminOrOwner(e)) return e.reply("你没有权限噢");
        let atQQ = this.getAtQQ(e);
        let [, user_id, time] = e.msg.match(/^#禁言(?: (\d+))?(?: (\d+))?$/) || [];
        user_id = user_id || atQQ;
        if (!user_id || !time) return e.reply("❌ 格式错误！正确格式：#禁言 @用户 60（秒）");
        await e.group.muteMember(Number(user_id), Number(time));
        e.reply(`🔇 已禁言 ${user_id} ${time} 秒`);
    }

    /** 解除禁言 */
    async unmuteMember(e) {
        if (!e.isMaster && !this.isAdminOrOwner(e)) return e.reply("你没有权限噢");
        let atQQ = this.getAtQQ(e);
        let [, user_id] = e.msg.match(/^#解除禁言(?: (\d+))?$/) || [];
        user_id = user_id || atQQ;
        if (!user_id) return e.reply("❌ 格式错误！正确格式：#解除禁言 @用户");
        await e.group.muteMember(Number(user_id), 0);
        e.reply(`✅ 已解除 ${user_id} 的禁言`);
    }

    /** 踢人 */
    async kickMember(e) {
        if (!e.isMaster && !this.isAdminOrOwner(e)) return e.reply("你没有权限噢");
        let atQQ = this.getAtQQ(e);
        let [, user_id] = e.msg.match(/^#踢人(?: (\d+))?$/) || [];
        user_id = user_id || atQQ;
        if (!user_id) return e.reply("❌ 格式错误！正确格式：#踢人 @用户");
        await e.group.kickMember(Number(user_id));
        e.reply(`🚪 已将 ${user_id} 移出群聊`);
    }

    /** 设置管理员 */
    async setAdmin(e) {
        if (!e.isMaster) return e.reply("你没有权限噢");
        let atQQ = this.getAtQQ(e);
        let [, user_id] = e.msg.match(/^#设置管理员 (\d+)$/) || [];
        user_id = user_id || atQQ;
        if (!user_id) return e.reply("❌ 格式错误！正确格式：#设置管理员 123456");
        await e.group.setAdmin(Number(user_id), true);
        e.reply(`✅ 已设置 ${user_id} 为管理员`);
    }

    /** 取消管理员 */
    async unsetAdmin(e) {
        if (!e.isMaster) return e.reply("你没有权限噢");
        let atQQ = this.getAtQQ(e);
        let [, user_id] = e.msg.match(/^#取消管理员 (\d+)$/) || [];
        user_id = user_id || atQQ;
        if (!user_id) return e.reply("❌ 格式错误！正确格式：#取消管理员 123456");
        await e.group.setAdmin(Number(user_id), false);
        e.reply(`✅ 已取消 ${user_id} 的管理员权限`);
    }

    /** 设置群名片 */
    async setGroupCard(e) {
        if (!e.isMaster && !this.isAdminOrOwner(e)) return e.reply("你没有权限噢");
        let atQQ = this.getAtQQ(e);
        let [, user_id, card] = e.msg.match(/^#设置名片(?: (\d+))? (.+)$/) || [];
        user_id = user_id || atQQ;
        if (!user_id || !card) return e.reply("❌ 格式错误！正确格式：#设置名片 @用户 新名片");
        await e.group.setCard(Number(user_id), card);
        e.reply(`✅ 已修改 ${user_id} 的名片为 ${card}`);
    }

    /** 获取群信息 */
    async getGroupInfo(e) {
        if (!e.isMaster && !this.isAdminOrOwner(e)) return e.reply("你没有权限噢");
        let info = e.group.info;
        e.reply(`📌 群信息：
群号：${info.group_id}
群主：${info.owner_id}
成员数：${info.member_count}
全员禁言：${info.all_muted ? "是" : "否"}`);
    }

    /** 获取成员信息 */
    async getMemberInfo(e) {
        if (!e.isMaster && !this.isAdminOrOwner(e)) return e.reply("你没有权限噢");
        let atQQ = this.getAtQQ(e);
        let [, user_id] = e.msg.match(/^#成员信息(?: (\d+))?$/) || [];
        user_id = user_id || atQQ;
        if (!user_id) return e.reply("❌ 格式错误！正确格式：#成员信息 @用户");
        let member = await e.group.pickMember(Number(user_id));
        e.reply(`👤 成员信息：
群名片：${member.card || "无"}
QQ：${member.user_id}
管理：${member.is_admin ? "是" : "否"}`);
    }

    /** 获取群成员列表 */
    async getMemberList(e) {
        if (!e.isMaster && !this.isAdminOrOwner(e)) return e.reply("你没有权限噢");
        let members = await e.group.getMemberMap();
        let msg = "👥 群成员列表：\n" + [...members.values()].map(m => `${m.nickname} (${m.user_id})`).join("\n");
        e.reply(msg);
    }

    /** 戳一戳 */
    async pokeMember(e) {
        if (!e.isMaster && !this.isAdminOrOwner(e)) return e.reply("你没有权限噢");
        let atQQ = this.getAtQQ(e);
        let [, user_id] = e.msg.match(/^#戳一戳(?: (\d+))?$/) || [];
        user_id = user_id || atQQ;
        await e.group.pokeMember(Number(user_id));
        e.reply(`👈 已戳 ${user_id}`);
    }
}
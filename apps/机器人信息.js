import plugin from "../../../lib/plugins/plugin.js";

export class BotInfo extends plugin {
    constructor() {
        super({
            name: "机器人信息",
            dsc: "查询机器人账号相关信息",
            event: "message",
            priority: 50,
            rule: [
                {
                    reg: "^#?(机器人|Bot)信息$",
                    fnc: "getBotInfo"
                }
            ]
        });
    }

    /** 📌 获取机器人账号信息 */
    async getBotInfo(e) {
        if (!e.bot) return e.reply("⚠️ 未检测到机器人信息");

        let bot = e.bot;

        let info = `🤖 机器人信息
━━━━━━━━━━━━━━
📌 账号 (uin): ${bot.uin}
📌 状态 (status): ${bot.status || "未知"}
📌 昵称 (nickname): ${bot.nickname || "未设置"}
📌 性别 (sex): ${bot.sex || "未知"}
📌 年龄 (age): ${bot.age || "未知"}
📌 频道账号 (tiny_id): ${bot.tiny_id || "无"}
━━━━━━━━━━━━━━
👥 好友列表: ${bot.fl?.size || 0} 位
🏡 群列表: ${bot.gl?.size || 0} 个
🚷 黑名单: ${bot.blacklist?.size || 0} 人
🎭 陌生人列表: ${bot.sl?.size || 0} 人
🗂 好友分组: ${bot.classes?.size || 0} 组
━━━━━━━━━━━━━━
🛠 系统信息
📁 本地存储路径: ${bot.dir || "未知"}
📊 数据统计: ${JSON.stringify(bot.stat || {}, null, 2)}
🔑 CSRF Token: ${bot.bkn || "无"}
🍪 Cookies: ${bot.cookies ? "✅ 已存储" : "❌ 未存储"}
━━━━━━━━━━━━━━`;

        e.reply(info);
    }
}
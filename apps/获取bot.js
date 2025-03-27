import plugin from "../../../lib/plugins/plugin.js";

export class BotInfo extends plugin {
    constructor() {
        super({
            name: "机器人信息",
            dsc: "获取机器人账号",
            event: "message",
            priority: 100,
            rule: [
                {
                    reg: "^#?(获取)?(机器人|bot)(账号|qq|uin)$",
                    fnc: "getBotUin"
                }
            ]
        });
    }

    /** 获取机器人账号 */
    getBotAccounts() {
        if (Array.isArray(Bot.uin)) {
            return Bot.uin; // 直接返回数组
        } else if (typeof Bot.uin === "number") {
            return [Bot.uin]; // 转为数组返回
        } else if (typeof Bot.uin === "string") {
            return [parseInt(Bot.uin, 10)]; // 确保是数字
        }
        return []; // 未获取到账号
    }

    /** 处理指令 */
    async getBotUin(e) {
        let botAccounts = this.getBotAccounts();
        if (botAccounts.length === 0) {
            return e.reply("未找到机器人账号");
        }
        e.reply(`🤖 机器人账号: ${botAccounts.join(", ")}`);
    }
}
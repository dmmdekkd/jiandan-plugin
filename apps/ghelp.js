import plugin from "../../../lib/plugins/plugin.js";
import image from "../model/image.js";
import Cfg from '../model/Cfg.js';

export class example2 extends plugin {
    constructor() {
        super({
            name: 'jiandan插件', // 插件名称
            dsc: '更换更美观的帮助', // 插件描述
            event: 'message', // 监听消息事件
            priority: -114514, // 优先级
            rule: [
                // 帮助命令
                {
                    reg: "^#?(群管|管理)(命令|帮助|菜单|help|说明|功能|指令|使用说明)$",
                    fnc: 'help' // 调用help方法
                }
            ]
        });
    }

    /**
     * 发送帮助图片
     * @param {Object} e 事件对象
     */
    async sendHelpImage(e) {
        let _path = process.cwd().replace(/\\/g, '/'); // 获取当前工作目录并替换反斜杠
        const config = Cfg.getconfig('config', 'ghelp'); // 获取帮助配置
        let { img } = await image(e, 'ghelp', 'help', { // 生成帮助图片
            saveId: 'help', // 保存ID
            cwd: _path, // 当前工作目录
            genshinPath: `${_path}/plugins/jiandan-plugin/resources/`, // 资源路径
            helpData: config, // 帮助数据
            version: HelpPluginVersion // 插件版本
        });
        e.reply(img); // 回复图片
    }

    /**
     * 处理帮助命令
     * @param {Object} e 事件对象
     */
    async help(e) {
        // 调用发送帮助图片方法
        await this.sendHelpImage(e);
    }
}

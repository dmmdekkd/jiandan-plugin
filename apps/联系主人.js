import fs from 'fs';
import path from 'path';

// 获取当前文件目录
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export class ContactMasterPlugin extends plugin {
  constructor(e) {
    super({
      name: '联系主人插件',
      dsc: '向指定主人推送消息并保存为JSON',
      event: 'message',
      priority: 9999,
      rule: [
        { reg: '^联系主人\\s*(.*)$', fnc: 'contactMaster' },  // 修改了正则表达式
      ]
    });
  }

  // 设置具有master权限的用户QQ号
  get masterQQ() {
    return 3448585471;  // 设置主人QQ号，这里以3448585471为例
  }

  // 保存消息到上级目录的JSON文件
  async saveMessage(user_id, msg) {
    const filePath = path.join(__dirname, '../m.json'); // 保存到上级目录

    let messages = [];

    // 检查文件是否存在，且文件内容是否有效
    if (fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath, 'utf8');
        // 如果文件内容为空，初始化为空数组
        if (data) {
          messages = JSON.parse(data);
        }
      } catch (error) {
        // 如果解析 JSON 失败，打印错误并继续使用空数组
        console.error('读取或解析 JSON 文件失败:', error);
      }
    }

    // 添加新的消息
    messages.push({
      user_id,
      message: msg,
      timestamp: new Date().toISOString()
    });

    // 保存回文件
    try {
      fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), 'utf8');
    } catch (error) {
      console.error('写入 JSON 文件失败:', error);
    }
  }

  async contactMaster(e) {
    const match = e.msg.match(/^联系主人\s*(.*)$/);  // 修改了正则表达式
    if (!match) return false;
    const [_, msg] = match;

    // 如果消息为空，提醒用户提供内容
    if (!msg.trim()) {
      return e.reply('示列 联系主人 xxx。');
    }

    try {
      // 保存消息到JSON文件
      await this.saveMessage(e.user_id, msg);

      // 获取发送者的昵称或者QQ号
      const userName = e.user_id || '未知用户';  // 如果没有昵称，使用QQ号代替

      // 推送消息到主人，并显示发送者的QQ号或昵称
      const messageToMaster = `来自 ${userName} 的消息：\n${msg}`;
      await Bot.pickFriend(this.masterQQ).sendMsg(messageToMaster);
      
      e.reply(`✅ 发送成功\n推送QQ：${Bot.uin}\n主人QQ：${this.masterQQ}\n内容：\n${msg}`);
    } catch (error) {
      e.reply(`❌ 发送失败\n推送QQ：${Bot.uin}\n主人QQ：${this.masterQQ}\n错误：\n${error.message || error}`);
    }

    return true;
  }
}
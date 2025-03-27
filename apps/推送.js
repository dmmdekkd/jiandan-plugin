export class PushFriendPlugin extends plugin {
  constructor(e) {
    super({
      name: '推送好友和群聊消息插件',
      dsc: '向指定好友或群聊推送消息，支持普通推送和转发推送',
      event: 'message',
      priority: 9999,
      rule: [
        { reg: '^(#|/)?推送好友\\s+(\\d+)\\s+([\\s\\S]+)$', fnc: 'pushFriend' },
        { reg: '^(#|/)?推送群聊\\s+(\\d+)\\s+([\\s\\S]+)$', fnc: 'pushGroup' },
        { reg: '^(#|/)?转发推送好友\\s+(\\d+)\\s+([\\s\\S]+)$', fnc: 'forwardPushFriend' },
        { reg: '^(#|/)?转发推送群聊\\s+(\\d+)\\s+([\\s\\S]+)$', fnc: 'forwardPushGroup' }
      ]
    });
  }

  async pushFriend(e) {
    const match = e.msg.match(/^推送好友\s+(\d+)\s+([\s\S]+)$/);
    if (!match) return false;
    const [_, friendId, msg] = match;
    try {
      await Bot.pickFriend(friendId).sendMsg(msg);
      e.reply(`✅ 发送成功\n推送QQ：${Bot.uin}\n好友QQ：${friendId}\n内容：\n${msg}`);
    } catch (error) {
      e.reply(`❌ 发送失败\n推送QQ：${Bot.uin}\n好友QQ：${friendId}\n错误：\n${error.message || error}`);
    }
    return true;
  }

  async pushGroup(e) {
    const match = e.msg.match(/^推送群聊\s+(\d+)\s+([\s\S]+)$/);
    if (!match) return false;
    const [_, groupId, msg] = match;
    try {
      await Bot.pickGroup(groupId).sendMsg(msg);
      e.reply(`✅ 发送成功\n推送QQ：${Bot.uin}\n群号：${groupId}\n内容：\n${msg}`);
    } catch (error) {
      e.reply(`❌ 发送失败\n推送QQ：${Bot.uin}\n群号：${groupId}\n错误：\n${error.message || error}`);
    }
    return true;
  }

  async forwardPushFriend(e) {
    const match = e.msg.match(/^转发推送好友\s+(\d+)\s+([\s\S]+)$/);
    if (!match) return false;
    const [_, friendId, msg] = match;
    try {
      const forwardMsg = Bot.makeForwardMsg([
        { user_id: Bot.uin, nickname: '推送助手', message: [{ type: 'text', text: msg }] }
      ]);
      await Bot.pickFriend(friendId).sendMsg(forwardMsg);
      e.reply(`✅ 转发成功\n推送QQ：${Bot.uin}\n好友QQ：${friendId}\n内容：\n${msg}`);
    } catch (error) {
      e.reply(`❌ 转发失败\n推送QQ：${Bot.uin}\n好友QQ：${friendId}\n错误：\n${error.message || error}`);
    }
    return true;
  }

  async forwardPushGroup(e) {
    const match = e.msg.match(/^转发推送群聊\s+(\d+)\s+([\s\S]+)$/);
    if (!match) return false;
    const [_, groupId, msg] = match;
    try {
      const forwardMsg = Bot.makeForwardMsg([
        { user_id: Bot.uin, nickname: '推送助手', message: [{ type: 'text', text: msg }] }
      ]);
      await Bot.pickGroup(groupId).sendMsg(forwardMsg);
      e.reply(`✅ 转发成功\n推送QQ：${Bot.uin}\n群号：${groupId}\n内容：\n${msg}`);
    } catch (error) {
      e.reply(`❌ 转发失败\n推送QQ：${Bot.uin}\n群号：${groupId}\n错误：\n${error.message || error}`);
    }
    return true;
  }
}
export class PushFriendPlugin extends plugin {
  constructor(e) {
    super({
      name: '推送好友和群聊消息插件',
      dsc: '通过命令向指定好友或群聊推送消息，支持转发推送、纯文本推送以及全部群聊、全部好友推送',
      event: 'message',
      priority: 9999,
      rule: [
        { reg: '^推送好友\\s+(\\d+)\\s+(.+)$', fnc: 'pushFriend' },
        { reg: '^推送群聊\\s+(\\d+)\\s+(.+)$', fnc: 'pushGroup' },
        { reg: '^推送全部好友\\s+(.+)$', fnc: 'pushAllFriends' },
        { reg: '^推送全部群聊\\s+(.+)$', fnc: 'pushAllGroups' },
        { reg: '^转发推送好友\\s+(\\d+)\\s+(.+)$', fnc: 'forwardPushFriend' },
        { reg: '^转发推送群聊\\s+(\\d+)\\s+(.+)$', fnc: 'forwardPushGroup' },
        { reg: '^转发推送全部好友\\s+(.+)$', fnc: 'forwardPushAllFriends' },
        { reg: '^转发推送全部群聊\\s+(.+)$', fnc: 'forwardPushAllGroups' }
      ]
    });
  }

  // 发送好友消息
  async pushFriend(e) {
    const regex = /^推送好友\s+(\d+)\s+(.+)$/;
    const match = e.msg.match(regex);
    if (!match) return false;

    const friendId = match[1];
    const msg = match[2];

    try {
      await Bot.pickFriend(friendId).sendMsg(msg);
      const replyMsg = `✅ 消息发送成功\n\n- 好友 QQ：${friendId}\n- 发送内容：\n${msg}`;
      e.reply(replyMsg);  // 以纯文本返回
    } catch (error) {
      const replyMsg = `❌ 消息发送失败\n\n- 好友 QQ：${friendId}\n- 错误信息：\n${error}`;
      e.reply(replyMsg);  // 以纯文本返回
    }
    return true;
  }

  // 发送群聊消息
  async pushGroup(e) {
    const regex = /^推送群聊\s+(\d+)\s+(.+)$/;
    const match = e.msg.match(regex);
    if (!match) return false;

    const groupId = match[1];
    const msg = match[2];

    try {
      await Bot.pickGroup(groupId).sendMsg(msg);
      const replyMsg = `✅ 消息发送成功\n\n- 群号：${groupId}\n- 发送内容：\n${msg}`;
      e.reply(replyMsg);  // 以纯文本返回
    } catch (error) {
      const replyMsg = `❌ 消息发送失败\n\n- 群号：${groupId}\n- 错误信息：\n${error}`;
      e.reply(replyMsg);  // 以纯文本返回
    }
    return true;
  }

  // 发送所有好友消息
  async pushAllFriends(e) {
    const regex = /^推送全部好友\s+(.+)$/;
    const match = e.msg.match(regex);
    if (!match) return false;

    const msg = match[1];
    let successCount = 0;
    let failureCount = 0;

    try {
      const friendMap = Bot.fl; // 获取所有好友列表
      for (let [friendId, friend] of friendMap) {
        try {
          await Bot.pickFriend(friendId).sendMsg(msg);
          successCount++;
        } catch (error) {
          failureCount++;
        }
      }

      const replyMsg = `✅ 消息已成功推送给所有好友。\n\n- 发送内容：\n${msg}\n\n- 成功推送 ${successCount} 个好友\n- 推送失败 ${failureCount} 个好友`;
      e.reply(replyMsg);  // 以纯文本返回
    } catch (error) {
      const replyMsg = `❌ 消息推送失败\n\n- 错误信息：\n${error}`;
      e.reply(replyMsg);  // 以纯文本返回
    }
    return true;
  }

  // 发送所有群聊消息
  async pushAllGroups(e) {
    const regex = /^推送全部群聊\s+(.+)$/;
    const match = e.msg.match(regex);
    if (!match) return false;

    const msg = match[1];
    let successCount = 0;
    let failureCount = 0;

    try {
      const groupMap = Bot.gl; // 获取所有群聊列表
      for (let [groupId, group] of groupMap) {
        try {
          await Bot.pickGroup(groupId).sendMsg(msg);
          successCount++;
        } catch (error) {
          failureCount++;
        }
      }

      const replyMsg = `✅ 消息已成功推送给所有群聊。\n\n- 发送内容：\n${msg}\n\n- 成功推送 ${successCount} 个群聊\n- 推送失败 ${failureCount} 个群聊`;
      e.reply(replyMsg);  // 以纯文本返回
    } catch (error) {
      const replyMsg = `❌ 消息推送失败\n\n- 错误信息：\n${error}`;
      e.reply(replyMsg);  // 以纯文本返回
    }
    return true;
  }

  // 转发推送好友消息
  async forwardPushFriend(e) {
    const regex = /^转发推送好友\s+(\d+)\s+(.+)$/;
    const match = e.msg.match(regex);
    if (!match) return false;

    const friendId = match[1];
    const msg = match[2];

    try {
      const forwardMessage = {
        user_id: friendId,
        message: msg,
      };
      
      await Bot.pickFriend(friendId).sendForwardMsg([forwardMessage]);
      
      const replyMsg = `✅ 转发消息成功\n\n- 好友 QQ：${friendId}\n- 发送内容：\n${msg}`;
      e.reply(replyMsg);  // 以纯文本返回
    } catch (error) {
      const replyMsg = `❌ 转发消息失败\n\n- 好友 QQ：${friendId}\n- 错误信息：\n${error}`;
      e.reply(replyMsg);  // 以纯文本返回
    }
    return true;
  }

  // 转发推送群聊消息
  async forwardPushGroup(e) {
    const regex = /^转发推送群聊\s+(\d+)\s+(.+)$/;
    const match = e.msg.match(regex);
    if (!match) return false;

    const groupId = match[1];
    const msg = match[2];

    try {
      const forwardMessage = {
        user_id: groupId,
        message: msg,
      };
      
      await Bot.pickGroup(groupId).sendForwardMsg([forwardMessage]);
      
      const replyMsg = `✅ 转发消息成功\n\n- 群号：${groupId}\n- 发送内容：\n${msg}`;
      e.reply(replyMsg);  // 以纯文本返回
    } catch (error) {
      const replyMsg = `❌ 转发消息失败\n\n- 群号：${groupId}\n- 错误信息：\n${error}`;
      e.reply(replyMsg);  // 以纯文本返回
    }
    return true;
  }

  // 转发推送所有好友消息
  async forwardPushAllFriends(e) {
    const regex = /^转发推送全部好友\s+(.+)$/;
    const match = e.msg.match(regex);
    if (!match) return false;

    const msg = match[1];
    let successCount = 0;
    let failureCount = 0;

    try {
      const friendMap = Bot.fl; // 获取所有好友列表
      const forwardMessages = [];
      for (let [friendId, friend] of friendMap) {
        forwardMessages.push({ user_id: friendId, message: msg });
      }

      if (forwardMessages.length > 0) {
        await Bot.sendForwardMsg(forwardMessages);
        successCount = forwardMessages.length;
      }

      const replyMsg = `✅ 转发消息已成功推送给所有好友。\n\n- 发送内容：\n${msg}\n\n- 成功转发 ${successCount} 个好友\n- 转发失败 ${failureCount} 个好友`;
      e.reply(replyMsg);  // 以纯文本返回
    } catch (error) {
      const replyMsg = `❌ 转发消息推送失败\n\n- 错误信息：\n${error}`;
      e.reply(replyMsg);  // 以纯文本返回
    }
    return true;
  }

  // 转发推送所有群聊消息
  async forwardPushAllGroups(e) {
    const regex = /^转发推送全部群聊\s+(.+)$/;
    const match = e.msg.match(regex);
    if (!match) return false;

    const msg = match[1];
    let successCount = 0;
    let failureCount = 0;

    try {
      const groupMap = Bot.gl; // 获取所有群聊列表
      const forwardMessages = [];
      for (let [groupId, group] of groupMap) {
        forwardMessages.push({ user_id: groupId, message: msg });
      }

      if (forwardMessages.length > 0) {
        await Bot.sendForwardMsg(forwardMessages);
        successCount = forwardMessages.length;
      }

      const replyMsg = `✅ 转发消息已成功推送给所有群聊。\n\n- 发送内容：\n${msg}\n\n- 成功转发 ${successCount} 个群聊\n- 转发失败 ${failureCount} 个群聊`;
      e.reply(replyMsg);  // 以纯文本返回
    } catch (error) {
      const replyMsg = `❌ 转发消息推送失败\n\n- 错误信息：\n${error}`;
      e.reply(replyMsg);  // 以纯文本返回
    }
    return true;
  }
}
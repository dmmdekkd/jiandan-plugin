export class GlobalPushPlugin extends plugin {
  constructor(e) {
    super({
      name: '全局推送插件',
      dsc: '向所有好友或群聊推送消息（需要主人权限）',
      event: 'message',
      priority: 10000,
      rule: [
        { reg: '^推送全部好友\\s+([\\s\\S]+)$', fnc: 'pushAllFriends' },
        { reg: '^推送全部群聊\\s+([\\s\\S]+)$', fnc: 'pushAllGroups' },
        { reg: '^转发推送全部好友\\s+([\\s\\S]+)$', fnc: 'forwardPushAllFriends' },
        { reg: '^转发推送全部群聊\\s+([\\s\\S]+)$', fnc: 'forwardPushAllGroups' }
      ]
    });
  }

  // 推送所有好友消息（需要主人权限）
  async pushAllFriends(e) {
    if (!e.isMaster) return e.reply("❌ 你没有权限执行此操作");

    const msg = e.msg.replace(/^推送全部好友\s+/, '');
    const friendMap = Bot.fl;
    let successCount = 0, failureCount = 0;

    for (const [friendId] of friendMap) {
      try { await Bot.pickFriend(friendId).sendMsg(msg); successCount++; } 
      catch { failureCount++; }
    }

    e.reply(`✅ 全部好友推送完成\n\n- 发送内容：${msg}\n- 成功：${successCount}\n- 失败：${failureCount}`);
    return true;
  }

  // 推送所有群聊消息（需要主人权限）
  async pushAllGroups(e) {
    if (!e.isMaster) return e.reply("❌ 你没有权限执行此操作");

    const msg = e.msg.replace(/^推送全部群聊\s+/, '');
    const groupMap = Bot.gl;
    let successCount = 0, failureCount = 0;

    for (const [groupId] of groupMap) {
      try { await Bot.pickGroup(groupId).sendMsg(msg); successCount++; } 
      catch { failureCount++; }
    }

    e.reply(`✅ 全部群聊推送完成\n\n- 发送内容：${msg}\n- 成功：${successCount}\n- 失败：${failureCount}`);
    return true;
  }
}
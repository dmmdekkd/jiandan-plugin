export class PushFriendPlugin extends plugin {
  constructor(e) {
    super({
      name: '推送好友和群聊消息插件',
      dsc: '通过命令向指定好友或群聊推送消息，支持转发推送、纯文本推送以及全部群聊、全部好友推送',
      event: 'message',
      priority: 9999,
      rule: [
        { reg: '^推送全部好友\\s+([\\s\\S]+)$', fnc: 'pushAllFriends' },
        { reg: '^推送全部群聊\\s+([\\s\\S]+)$', fnc: 'pushAllGroups' },
        { reg: '^转发推送全部好友\\s+([\\s\\S]+)$', fnc: 'forwardPushAllFriends' },
        { reg: '^转发推送全部群聊\\s+([\\s\\S]+)$', fnc: 'forwardPushAllGroups' }
      ]
    });
  }

  /** 推送所有好友 */
  async pushAllFriends(e) {
    if (!e.isMaster) return e.reply("❌ 你没有权限执行此操作");

    const match = e.msg.match(/^推送全部好友\s+([\s\S]+)$/);
    if (!match) return false;
    const msg = match[1].trim();
    let successCount = 0, failureCount = 0;

    try {
      const friendMap = Bot.fl; // 获取所有好友列表
      for (let [friendId, friend] of friendMap) {
        try {
          await Bot.pickFriend(friendId).sendMsg(msg);
          successCount++;
        } catch {
          failureCount++;
        }
      }
      e.reply(`✅ 消息已推送给所有好友。\n\n📌 发送内容：\n${msg}\n\n✔️ 成功 ${successCount} 人\n❌ 失败 ${failureCount} 人`);
    } catch (error) {
      e.reply(`❌ 推送失败\n\n错误信息：\n${error}`);
    }
    return true;
  }

  /** 推送所有群聊 */
  async pushAllGroups(e) {
    if (!e.isMaster) return e.reply("❌ 你没有权限执行此操作");

    const match = e.msg.match(/^推送全部群聊\s+([\s\S]+)$/);
    if (!match) return false;
    const msg = match[1].trim();
    let successCount = 0, failureCount = 0;

    try {
      const groupMap = Bot.gl; // 获取所有群聊列表
      for (let [groupId, group] of groupMap) {
        try {
          await Bot.pickGroup(groupId).sendMsg(msg);
          successCount++;
        } catch {
          failureCount++;
        }
      }
      e.reply(`✅ 消息已推送给所有群聊。\n\n📌 发送内容：\n${msg}\n\n✔️ 成功 ${successCount} 群\n❌ 失败 ${failureCount} 群`);
    } catch (error) {
      e.reply(`❌ 推送失败\n\n错误信息：\n${error}`);
    }
    return true;
  }

  /** 转发推送所有好友 */
  async forwardPushAllFriends(e) {
    if (!e.isMaster) return e.reply("❌ 你没有权限执行此操作");

    const match = e.msg.match(/^转发推送全部好友\s+([\s\S]+)$/);
    if (!match) return false;
    const msg = match[1].trim();
    let successCount = 0, failureCount = 0;

    try {
      const friendMap = Bot.fl;
      const forwardMessages = [];
      for (let [friendId, friend] of friendMap) {
        forwardMessages.push({ user_id: friendId, message: msg });
      }

      if (forwardMessages.length > 0) {
        await Bot.sendForwardMsg(forwardMessages);
        successCount = forwardMessages.length;
      }

      e.reply(`✅ 转发消息已推送给所有好友。\n\n📌 发送内容：\n${msg}\n\n✔️ 成功 ${successCount} 人\n❌ 失败 ${failureCount} 人`);
    } catch (error) {
      e.reply(`❌ 转发失败\n\n错误信息：\n${error}`);
    }
    return true;
  }

  /** 转发推送所有群聊 */
  async forwardPushAllGroups(e) {
    if (!e.isMaster) return e.reply("❌ 你没有权限执行此操作");

    const match = e.msg.match(/^转发推送全部群聊\s+([\s\S]+)$/);
    if (!match) return false;
    const msg = match[1].trim();
    let successCount = 0, failureCount = 0;

    try {
      const groupMap = Bot.gl;
      const forwardMessages = [];
      for (let [groupId, group] of groupMap) {
        forwardMessages.push({ user_id: groupId, message: msg });
      }

      if (forwardMessages.length > 0) {
        await Bot.sendForwardMsg(forwardMessages);
        successCount = forwardMessages.length;
      }

      e.reply(`✅ 转发消息已推送给所有群聊。\n\n📌 发送内容：\n${msg}\n\n✔️ 成功 ${successCount} 群\n❌ 失败 ${failureCount} 群`);
    } catch (error) {
      e.reply(`❌ 转发失败\n\n错误信息：\n${error}`);
    }
    return true;
  }
}
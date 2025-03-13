export class FriendMessagePlugin extends plugin {
  constructor() {
    super({
      name: '好友 & 群查询插件',
      dsc: '查询好友列表和QQ群列表（纯文本 + 头像）',
      event: 'message',
      priority: 9999,
      rule: [
        { reg: '^查询好友$', fnc: 'queryFriends' },
        { reg: '^查询群$', fnc: 'queryGroups' }
      ]
    });
  }

  // **查询好友列表**
  async queryFriends(e) {
    try {
      const friendMap = Bot.fl; // 获取好友列表
      if (!friendMap || friendMap.size === 0) {
        return e.reply("📋 我的好友列表\n\n❌ 未查询到任何好友信息。");
      }

      let forwardMessages = [];
      friendMap.forEach((friend, id) => {
        const nickname = friend.nickname || "未知";
        if (nickname === "未知") return; // 如果昵称是“未知”，则跳过该好友
        const avatarUrl = `http://q1.qlogo.cn/g?b=qq&nk=${id}&s=100`; // 头像缩略图

        forwardMessages.push({
          user_id: 0,
          nickname: nickname,
          avatar: avatarUrl,
          message: `好友: ${id}\n昵称: ${nickname}`
        });
      });

      const replyMsg = `📋 我的好友列表\n\n共 ${forwardMessages.length} 位好友：`;
      e.reply(replyMsg);
      if (forwardMessages.length > 0) {
        e.reply(await Bot.makeForwardMsg(forwardMessages));
      } else {
        e.reply("❌ 没有可显示的好友信息。");
      }
    } catch (error) {
      e.reply(`📋 我的好友列表\n\n❌ 查询失败：\n${error}`);
    }
    return true;
  }

  // **查询QQ群列表**
  async queryGroups(e) {
    try {
      const groupMap = Bot.gl; // 获取群列表
      if (!groupMap || groupMap.size === 0) {
        return e.reply("📋 我的QQ群列表\n\n❌ 未查询到任何群信息。");
      }

      let forwardMessages = [];
      groupMap.forEach((group, id) => {
        const groupName = group.group_name || "未知";
        if (groupName === "未知") return; // 如果群名称是“未知”，则跳过该群
        const avatarUrl = `http://p.qlogo.cn/gh/${id}/${id}/100`; // 群头像缩略图

        forwardMessages.push({
          user_id: 0,
          nickname: groupName,
          avatar: avatarUrl,
          message: `群号: ${id}\n群名称: ${groupName}`
        });
      });

      const replyMsg = `📋 我的QQ群列表\n\n共 ${forwardMessages.length} 个群：`;
      e.reply(replyMsg);
      if (forwardMessages.length > 0) {
        e.reply(await Bot.makeForwardMsg(forwardMessages));
      } else {
        e.reply("❌ 没有可显示的群信息。");
      }
    } catch (error) {
      e.reply(`📋 我的QQ群列表\n\n❌ 查询失败：\n${error}`);
    }
    return true;
  }
}
export class GetGroupInfoPlugin extends plugin {
  constructor(e) {
    super({
      name: '获取群号插件',
      dsc: '查询当前群号或列出 Bot 所在的所有群',
      event: 'message',
      priority: 1000,
      rule: [
        {
          reg: '^查询群号$',
          fnc: 'getCurrentGroup'
        },
        {
          reg: '^查询所有群$',
          fnc: 'getAllGroups'
        }
      ]
    })
  }

  // **获取当前群号**
  async getCurrentGroup() {
    if (!this.e.isGroup) {
      await this.reply('请在群聊中使用该命令。')
      return
    }
    await this.reply(`当前群号：${this.e.group_id}`)
  }

  // **获取 Bot 所在的所有群**
  async getAllGroups() {
    try {
      const groupList = await Bot.getGroupList() // **确保 `getGroupList()` 是 `await` 调用的**

      if (!groupList || groupList.length === 0) {
        await this.reply('当前 Bot 没有加入任何群。')
        return
      }

      let msg = 'Bot 所在的群：\n'
      groupList.forEach(group => {
        const groupId = group.group_id || group.id || '未知ID' // **兼容不同框架**
        const groupName = group.group_name || group.name || '未知名称'
        msg += `群号：${groupId} | 群名：${groupName}\n`
      })

      await this.reply(msg)
    } catch (error) {
      console.error('获取群列表失败：', error)
      await this.reply('获取群列表失败，请检查 Bot 是否有相关权限。')
    }
  }
}
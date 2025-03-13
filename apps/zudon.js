export class ScheduledTextPlugin extends plugin {
  constructor(e) {
    super({
      name: '定时文本消息插件',
      dsc: '每30分钟发送一条文本消息到指定群',
      event: 'message',
      priority: 9999,
      rule: [] // 此插件无需匹配指令
    })

    // 定时任务：每 30 分钟执行一次
    this.task = {
      cron: '0 */30 * * * *', // cron 表达式，每30分钟执行一次（分钟位为0，表示整点开始）
      name: '定时文本消息任务',
      fnc: () => this.sendScheduledMessage(),
      log: false
    }

    // 你可以在这里指定目标群号（群号请替换为实际数字）
    this.targetGroupId = ''
  }

  // 定时任务执行的方法
  async sendScheduledMessage() {
    const text = '' // 设置要发送的文本内容
    
    // 发送文本消息到指定群聊
    await Bot.pickGroup(this.targetGroupId).sendMsg(text)
    console.log(`[定时任务] 已发送至群 ${this.targetGroupId}：${text}`)
    
    // 发送图片消息到指定群聊
    const imageUrl = "http://47.113.216.189:3000"  // 图片链接
    await Bot.pickGroup(this.targetGroupId).sendMsg([segment.image(imageUrl)])
    console.log(`[定时任务] 已发送图片至群 ${this.targetGroupId}`)
  }
}

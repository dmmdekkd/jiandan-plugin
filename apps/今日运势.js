import fetch from "node-fetch";
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
export class xgn extends plugin {
  constructor() {
    super({
      name: '今日运势',
      dsc: '今日运势查询',
      event: 'message',
      priority: 1045,
      rule: [{
        reg: '(#|/)?今日运势',
        fnc: 'jrys'
      }]
    })
  }

  async jrys(e) {
    try {
      let url = 'http://datukuai.top:1450/jrys.php?qq=' + String(e.user_id)
      let res = await fetch(url)
      res = await res.json()
      
      let fortuneSummary = res.fortuneSummary
      let luckyStar = res.luckyStar
      let signText = res.signText
      let unSignText = res.unSignText
      let msg = `今日运势：${fortuneSummary}\n幸运星级：${luckyStar}\n运势解读：${signText}\n专属箴言：${unSignText}`
      e.reply([segment.at(e.user_id), '\n', msg])
    } catch {
      let url = 'https://api.fanlisky.cn/api/qr-fortune/get/' + String(e.user_id)
      let res = await fetch(url)
      res = await res.json()
      res = res.data
      
      let fortuneSummary = res.fortuneSummary
      let luckyStar = res.luckyStar
      let signText = res.signText
      let unSignText = res.unSignText
      let msg = `今日运势：${fortuneSummary}\n幸运星级：${luckyStar}\n运势解读：${signText}\n专属箴言：${unSignText}`
      e.reply([segment.at(e.user_id), '\n', msg])
    }
  }
}

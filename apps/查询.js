
export class QQLevelQuery extends plugin {
  constructor() {
    super({
      name: 'QQ等级查询',
      dsc: '查询 QQ 等级信息，支持艾特、输入 QQ 号或查询自己',
      event: 'message',
      priority: 1000,
      rule: [
        {
          reg: /^#?查询信息\s?(?:@?\d{5,11})?$/,
          fnc: 'getQQLevel'
        }
      ]
    });
  }

  async getQQLevel(e) {
    let qq = null;

    // **解析艾特的 QQ 号**
    if (e.message) {
      for (let msg of e.message) {
        if (msg.type === "at") {
          qq = msg.qq;
          break;
        }
      }
    }

    // **如果没艾特，尝试解析指令里的 QQ 号**
    if (!qq) {
      qq = e.msg.match(/\d{5,11}/)?.[0];
    }

    // **如果还没找到 QQ，默认查询自己**
    if (!qq) {
      qq = e.user_id;
    }

    e.reply(`正在查询 QQ 号 ${qq} 的等级信息，请稍等...`);

    try {
      let apiUrl = `http://jiuli.xiaoapi.cn/i/qq/qq_level.php?qq=${qq}&return=json`;
      let res = await fetch(apiUrl);
      let data = await res.json();

      if (!data || data.code !== 200) {
        e.reply(`查询失败：${data?.msg || '未知错误'}`);
        return;
      }

      // **修正注册时间格式**
      let regTime = data.RegistrationTime;
      if (regTime && regTime.includes(' ')) {
        regTime = regTime.replace(/\.\d+$/, ''); // 去掉小数点后的毫秒数
      } else {
        regTime = '未知'; // 防止 API 数据错误
      }

      let msg = `🎭 QQ 信息查询 🎭\n`
              + `QQ号：${data.qq}\n`
              + `昵称：${data.name || '未知'}\n`
              + `性别：${data.sex || '未知'}\n`
              + `年龄：${data.age || '未知'}\n`
              + `等级：${data.level || '未知'}\n`
              + `成长值：${data.iGrowthValue || '未知'}\n`
              + `成长速度：${data.iGrowthSpeed || '未知'}\n`
              + `会员等级：${data.iVipLevel || '无'}\n`
              + `在线状态：${data.online_status || '未知'}\n`
              + `注册时间：${regTime}\n`
              + `IP 属地：${data.ip_city || '未知'}\n`
              + `个性签名：${data.sign || '无'}\n`
              + `QQ 赞：${data.like || '0'}\n`;

      let imgUrl = data.headimg;

      // **方式 1：直接发送网络图片**
      e.reply([
        segment.image(imgUrl), 
        msg
      ]);

    } catch (err) {
      e.reply('查询 QQ 等级时出错，请稍后再试！');
      console.error('QQ 等级查询出错:', err);
    }
  }
}
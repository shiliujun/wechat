/*处理用户发送的请求，定义响应的数据*/

module.exports = (userData) => {
    let options = {
        toUserName: userData.FromUserName,
        fromUserName: userData.ToUserName,
        createTime: Date.now(),
        type: 'text',
        content: '大吉大利，今晚吃鸡！'
    }
    if (userData.MsgType === 'text') {
        if (userData.Content === '1') {
            options.content = '来对狙啊！爆头的那种！';
        } else if (userData.Content && userData.Content.indexOf('2') !== -1) {
            console.log(userData.Content)
            options.content = '来钢枪啊！\n 倒地的那种！';
        }
    } else if (userData.MsgType === 'voice') {
        //将用户发送的语音消息， 返回语音识别结果给用户（需要开通才能生效）
        options.content = userData.Recognition;

    } else if (userData.MsgType === 'location') {
        //用户发送的是地理位置信息
        options.content = `地理位置纬度：${userData.Location_X} 
        \n地理位置经度:${userData.Location_Y}
        \n地图缩放大小:${userData.Scale}
        \n地理位置信息:${userData.Label}`;
    } else if (userData.MsgType === 'event') {
        if (userData.Event === 'subscribe') {
            //用户订阅事件
            options.content = '初次见面，我就喜欢你了，文化人说这是一见钟情';
            if (userData.EventKey) {
                // 扫描带参数的二维码 --> 不是普通二维码  活动中使用
                options.content = '扫码送店啦~~'
            }
        } else if (userData.Event === 'unsubscribe') {
            console.log('无情取关');
            //如果不给值， 微信服务器会请求三次
            // options.content = '';
        } else if (userData.Event === 'CLICK') {
            // 用户点击菜单
            options.content = '用户点击了菜单~';
        }
    }

    return options;
}
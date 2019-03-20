/*处理用户发送的请求，定义响应的数据*/

module.exports=(userData)=>{
    let options = {
        toUserName: userData.FromUserName,
        fromUserName: userData.ToUserName,
        createTime: Date.now(),
        type: 'text',
        content: '大吉大利，今晚吃鸡！'
    }

    if (userData.Content === '1') {
        options.content = '来对狙啊！爆头的那种！';
    } else if (userData.Content && userData.Content.indexOf('2') !== -1) {
        console.log(userData.Content)
        options.content = '来钢枪啊！\n 倒地的那种！';
    }
    if (userData.MsgType === 'image') {
        //将用户发送的图片返回
        options.mediaId = userData.MediaId;
        options.type = 'image';
    }
    return options;
}
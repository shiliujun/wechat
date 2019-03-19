//封装的中间件函数
const sha1 = require('sha1');
const {getUserDataAsync, parseXMLData, formatJsData} = require('../utils/tools');
const template = require('./template');
module.exports = () => {
    return async (req, res) => {
        //console.log(req.query);
        //微信服务器发送过来的请求参数
        const {signature, echostr, timestamp, nonce} = req.query;
        const token = 'dabaiya1128';

        //通过微信签名算法加密出来微信签名
        const sha1Sorted = sha1([token, timestamp, nonce].sort().join(''));

        if (req.method === 'GET') {
            // 处理验证服务器消息有效性
            if (sha1Sorted === signature) {
                // 说明消息来自于微信服务器
                res.end(echostr);
            } else {
                res.end(error);
            }
        } else if (req.method === 'POST') {
            //console.log(req.body);{}

            //过滤掉不是微信服务器发送的消息
            if (sha1Sorted !== signature) {
                res, end('error');
                return;
            }

            //获取用户发送的消息
            const xmlData = await getUserDataAsync(req);

            //讲xml数据转换成js对象
            const jsData = parseXMLData(xmlData);

            //格式化jsData
            const userData = formatJsData(jsData);

            //实现自动回复
            let options = {
                toUserName: userData.FromUserName,
                fromUserName: userData.ToUserName,
                createTime: Data.now(),
                type: 'text',
                content: '大吉大利，今晚吃鸡！'
            }

            if (userData.Content === '1') {
                options.content = '来对狙啊！爆头的那种！';
            } else if (userData.Content && userData.Content.indexOf(' 2 ') !== -1) {
                options.content = '来钢枪啊！\n 倒地的那种！';
            }
            if (userData .MsgType === 'image') {
                //将用户发送的图片返回
                options.mediaId = userData.MediaId;
                options.type = 'image';
            }

            const replyMessage = template(options);
            console.log(replyMessage);
            //返回响应
            res.send(replyMessage);

        } else {
            res.end('error');
        }

    }
}
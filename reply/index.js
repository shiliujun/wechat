
//封装的中间件函数
const sha1 = require('sha1');
const {getUserDataAsync, parseXMLData, formjsData} = require('../utils/tools');

module.exports = () => {
     return async (req, res) => {
        //console.log(req.query);

        const {signature, echostr, timestamp, nonce} = req.query;
        const token = 'dabaiya1128';

        const sha1Sorted = sha1([token, timestamp, nonce].sort().join(''));

        if (req.method === 'GET') {
            if (sha1Sorted === signature) {
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
            const userData = formjsData(jsData);

            //实现自动回复
            let content = '大吉大利，今晚吃鸡！';
            if (userData.Content === '1') {
                content = '来对狙啊！爆头的那种！';
            } else if (userData.Content.indexOf('2') !== -1) {
                content = '来钢枪啊！\n 倒地的那种！';
            }

            let replyMessage = `<xml>
                  <ToUserName><![CDATA[${userData.FromUserName}]]></ToUserName>
                  <FromUserName><![CDATA[${userData.ToUserName}]]></FromUserName>
                  <CreateTime>${Date.now()}</CreateTime>
                  <MsgType><![CDATA[text]]></MsgType>
                  <Content><![CDATA[${content}]]></Content>
                </xml>`
            //返回响应
            res.send(replyMessage);

        } else {
            res.end('error');
        }

    }
}
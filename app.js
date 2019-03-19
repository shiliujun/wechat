const express = require('express');
const sha1 = require('sha1');
const {parseString} = require('xml2js');

const app = express();


app.use(async (req, res) => {
    //console.log(req.query);

    const {signature, echostr, timestamp, nonce} = req.query;
    const token = 'dabaiya1128';

    const sortedArr = [token, timestamp, nonce].sort();

    const sha1Sorted = sha1(sortedArr.join(''));
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
            res,end('error');
            return;
        }

        //获取用户发送的消息
        const xmlData = await  new Promise((resolve, reject) => {
            let xmlData = '';
            req
                .on('data', data => {
                    xmlData += data.toString();
                    /*
                    <xml>
                        <ToUserName><![CDATA[gh_cd9b056e3ab8]]></ToUserName> 开发者微信测试号id
                        <FromUserName><![CDATA[octh_5rCAfL1X2JDWMFLNDlpRpC8]]></FromUserName> 用户的openid
                        <CreateTime>1552993958</CreateTime> 发送消息的时间戳
                        <MsgType><![CDATA[text]]></MsgType> 发送消息的类型
                        <Content><![CDATA[333]]></Content> 发送消息的内容
                        <MsgId>22233528723546947</MsgId> 发送消息的id （默认保留三天，三天后销毁）
                    </xml>
                    */
                })
                .on('end', () => {
                    //说明数据接收完毕
                    resolve(xmlData);
                })
        })

        //讲xml数据转换成js对象
        let jsData = null;

        /*
        { xml:
           { ToUserName:  'gh_cd9b056e3ab8' ,
             FromUserName:  'octh_5rCAfL1X2JDWMFLNDlpRpC8' ,
             CreateTime:  '1552995511' ,
             MsgType: 'text' ,
             Content:  '555' ,
             MsgId: '22233547075659751'  } }
         */

        //字符串首尾去空格{trim:true}
        parseString(xmlData, {trim: true}, (err, result) => {
            if (!err) {
                jsData = result;
            } else {
                jsData = {};
            }
        })

        //格式化jsData
        const {xml} = jsData;
        const userData = {};
        for (let key in xml) {
            //获取属性值
            const value = xml[key];
            //去掉数组
            userData[key] = value[0];
        }
        console.log(userData);
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

})

app.listen(3000, err => {
    if (!err) console.log('服务器启动成功了~');
    else console.log(err);
})

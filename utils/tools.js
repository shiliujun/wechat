/*工具函数模块*/
const {parseString} = require('xml2js');

module.exports = {
     //获取用户发送的消息
     getUserDataAsync(req) {
        return new Promise((resolve, reject) => {
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
    },

    //讲xml数据转换成js对象
    parseXMLData(xmlData){
        let jsData = null;
        //字符串首尾去空格{trim:true}
        parseString(xmlData, {trim: true}, (err, result) => {
            if (!err) {
                jsData = result;
            } else {
                jsData = {};
            }
        })
        return jsData;
    },

    //格式化jsData的方法
    formjsData(jsData){
        const {xml} = jsData;
        const userData = {};
        for (let key in xml) {
            //获取属性值
            const value = xml[key];
            //去掉数组
            userData[key] = value[0];
        }
        return userData;
    }


}
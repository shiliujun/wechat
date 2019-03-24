//封装的中间件函数模块：接受请求，返回响应

const sha1 = require('sha1');
const {getUserDataAsync, parseXMLData, formatJsData} = require('../utils/tools');
const template = require('./template');
const handleResponse = require('./handleResponse');
const {token} = require('../config/index');

module.exports = () => {
    return async (req, res) => {
        //console.log(req.query);
        //微信服务器发送过来的请求参数
        const {signature, echostr, timestamp, nonce} = req.query;

        //通过微信签名算法加密出来微信签名
        const sha1Sorted = sha1([token, timestamp, nonce].sort().join(''));

        if (req.method === 'GET') {
            // 处理验证服务器消息有效性
            if (sha1Sorted === signature) {
                //说明消息来自于微信服务器
                res.end(echostr);
            } else {
                //说明消息不是微信服务器
                res.end('error');
            }
        } else if (req.method === 'POST') {
            //过滤掉不是微信服务器发送的消息
            if (sha1Sorted !== signature) {
                res.end('error');
                return;
            }

            //获取用户发送的消息
            const xmlData = await getUserDataAsync(req);

            //讲xml数据转换成js对象
            const jsData = parseXMLData(xmlData);

            //格式化jsData
            const userData = formatJsData(jsData);

            //实现自动回复,处理用户发送的请求，定义响应的数据
            const options = handleResponse(userData);

            // 用于定义回复用户消息的6种模板模块
            const replyMessage = template(options);

            // 如果响应错误， 看打印结果是否错误,再看是哪个模板出现了问题
            console.log(replyMessage);
            //返回响应
            res.send(replyMessage);

        } else {
            res.end('error');
        }

    }
}
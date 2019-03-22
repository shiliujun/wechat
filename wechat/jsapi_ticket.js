/*定义获取jsapi_ticket的模块*/
const rp = require('request-promise-native');
const fetchAccessToken = require('./accessToken');

const {writeFileAsync, readFileAsync} = require('../utils/tools');

async function getJsapiTicket() {
    const {access_token} = await fetchAccessToken();
    //定义请求地址
    const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
    //发送请求
    const result = await rp({method: 'GET', url, json: true});
    //设置过期时间
    result.expires_in = Date.now() + 7200000 - 300000;
    const ticket = {
        ticket: result.ticket,
        expires_in: result.expires_in
    }
    //保存下来
    await writeFileAsync('./jsapiTicket.txt', ticket);
    return result;
}

//定义最终得到的jsapi_ticket的函数
function fetchJsapiTicket() {
    return readFileAsync('./jsapiTicket.txt')
        .then((res) => {
            if (res.expires_in < Date.now()) {
                return getJsapiTicket();
            } else {
                return res;
            }
        })
        .catch(err => {
            return getJsapiTicket();
        })

}

/*(async () => {
    const result = await fetchJsapiTicket();
    console.log(result);
})()*/

module.exports = fetchJsapiTicket;
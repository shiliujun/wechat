/*定义获取access_token的模块*/
const rp = require('request-promise-native');
const {writeFileAsync, readFileAsync} = require('../utils/tools');
const {appId, appSecret} = require('../config/index');

async function getAccessToken() {
    //定义请求地址
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
    //发送请求
    const result = await rp({method: 'GET', url, json: true});
    //设置过期时间
    result.expires_in = Date.now() + 7200000 - 300000;
    //保存下来
    await writeFileAsync('./accessToken.txt', result);
    return result;
}

//定义最终得到的access_token的函数
module.exports = function fetchAccessToken() {
    return readFileAsync('./accessToken.txt')
        .then((res) => {
            if (res.expires_in < Date.now()) {
                return getAccessToken();
            } else {
                return res;
            }
        })
        .catch(err => {
            return getAccessToken();
        })

}


/*(async () => {
    const result = await fetchAccessToken();
    console.log(result);
})()*/


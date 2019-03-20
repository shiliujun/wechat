/*定义获取access_token的模块*/
const rp = require('request-promise-native');
const {writeFile} = require('fs');

async function getaccessToken() {

    const appId = 'wxe4c8a7b61d8bec3a';
    const appSecret = '787e8a6947d46bd0542fa73892dc04b4';
    //定义请求地址
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;

    //发送请求
    const result = await rp({method: 'GET', url, json: true});
    //设置过期时间
    result.expires_in = Date.now() + 7200000 - 300000;

    //保存下来
    writeFile('./accessToken.txt', JSON.stringify( result), err => {
        if (!err) console.log('文件保存成功了~~');
        else console.log(err);
    })

    //返回获取好的access_token
    return result;

    console.log(result);

}

getaccessToken();
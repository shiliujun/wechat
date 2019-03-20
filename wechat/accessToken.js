const rp = require('request-promise-native');

const {writeFile, readFile} = require('fs');

//发送请求、获取access_token，保存起来，设置过期时间
async function getAt() {
    // 定义请求
    const appId = 'wxe4c8a7b61d8bec3a';
    const appSecret = '787e8a6947d46bd0542fa73892dc04b4';
    const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}';
    //发送请求
    //下载了 request request-promise-native
    const result = await rp({method: 'GET', url, json: true});

    //设置过期时间 2小时更新，提前5分钟刷新
    result.expires_in = Date.now() + 7200000 - 300000;

    // 保存为一个文件 ---> 只能保存字符串数据，将js对象转换为json字符串
    writeFile('./accessToken.text', JSON.stringify(result), (err) => {
        if (!err) console.log('文件保存成功了~~');
        else console.log(err);
    })
    return result;
}

// 得到最终有效的access_token
module.exports = function fetchAt() {
    return new Promise((resolve, reject) => {
        readFile('./assessToken.text', (err, data) => {
            if (!err) {
                resolve(JSON.parse(data.toString()));
            } else {
                reject(err);
            }
        })
    })
        .then(res => {
            if (res.expires_in < Date.now()) {
                return getAt();
            } else {
                return res;
            }
        })
        .catch(err => {
            return getAt();
        })

}
/*实现微信公众号提供的各个接口*/
const rp = require('request-promise-native');
const fetchAccessToken = require('./accessToken');

const menu = {
    "button": [
        {
            "type": "click",
            "name": "贵在坚持💰",
            "key": "贵在坚持"
        },
        {
            "name": "难在坚持🔥",
            "sub_button": [
                {
                    "type": "view",
                    "name": "网恋选我📳",
                    "url": "https://music.163.com/"
                },
                {
                    "type": "click",
                    "name": "我最甜🍰",
                    "key": "我最甜"
                }

            ]
        },
        {
            "name": "成在坚持✈",
            "sub_button": [
                {
                    "type": "view",
                    "name": "又骗感情又骗钱🍹",
                    "url": "https://www.zhihu.com/"
                },
                {
                    "type": "scancode_waitmsg",
                    "name": "扫码送店🎉",
                    "key": "扫码送店！",
                },
                {
                    "type": "scancode_push",
                    "name": "扫码领千万红包💄",
                    "key": "扫码领千万红包！",
                },
                {
                    "type": "pic_photo_or_album",
                    "name": "仙女下凡啦👸",
                    "key": "仙女下凡啦！",
                },
                {
                    "type": "pic_weixin",
                    "name": "天生丽质🌑",
                    "key": "天生丽质！",
                }]
        }]
}

async function createMenu() {
    const {access_token} = await fetchAccessToken();
    const url = ` https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`;
    const result = await rp({method: 'POST', url, json: true, body: menu});
    return result;
}

async function deleteMenu() {
    const {access_token} = await fetchAccessToken();
    const url = ` https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${access_token}`;
    const result = await rp({method: 'GET', url, json: true});
    return result;
}

(async () => {
    let result = await deleteMenu();
    console.log(result);
    result = await createMenu();
    console.log(result);
})()
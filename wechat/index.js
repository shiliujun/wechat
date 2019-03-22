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

async function createTag(name) {
    const {access_token} = await fetchAccessToken();
    const url = ` https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`;
    return await rp({method: 'POST', url, json: true, body: {tag: {name}}});
}

async function getTagUsers(tagid, next_openid = '') {
    // 获取access_token
    const { access_token } = await fetchAccessToken();
    // 定义请求
    const url = `${URL_PREFIX}user/tag/get?access_token=${access_token}`;
    // 发送请求
    return await rp({method: 'POST', url, json: true, body: {tagid, next_openid}});
}

async function batchUsersTag(openid_list, tagid) {
    // 获取access_token
    const { access_token } = await fetchAccessToken();
    // 定义请求
    const url = `${URL_PREFIX}tags/members/batchtagging?access_token=${access_token}`;
    // 发送请求
    return await rp({method: 'POST', url, json: true, body: {openid_list, tagid}});
}

async function sendMessage(body) {
    // 获取access_token
    const {access_token} = await fetchAccessToken();
    // 定义请求
    const url = `${URL_PREFIX}message/mass/sendall?access_token=${access_token}`;
    // 发送请求
    return await rp({method: 'POST', url, json: true, body});
}

(async () => {
    const body = {
        "filter":{
            "is_to_all":false,  // 是否添加进历史记录
            "tag_id": 139
        },
        "text":{
            "content": '测试群发消息~ \n点击提前学习后面的课程 \n<a href="https://segmentfault.com/a/1190000018534625">webpack4开发教程</a>'
        },
        "msgtype":"text"
    }
    const result = await sendMessage(body);
    console.log(result);
})()
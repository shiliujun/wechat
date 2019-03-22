const express = require('express');
const sha1 = require('sha1');
const reply = require('./reply');
const fetchJsapiTicket = require('./wechat/jsapi_ticket');
const app = express();

//配置ejs
app.set('views', 'views');
app.set('view engine', 'ejs');

app.get('/search', async (req, res) => {
    const {ticket} = await fetchJsapiTicket();
    const url = 'http://56c65a63.ngrok.io/search';
    const noncestr = Math.random().toString().slice(2);
    const timestamp = Math.round(Date.now() / 1000);
    const arr = [
        `jsapi_ticket=${ticket}`,
        `url=${url}`,
        `noncestr=${noncestr}`,
        `timestamp=${timestamp}`
    ]
    const signature = sha1(arr.sort().join('&'));
    res.render('search', {noncestr,timestamp,signature,url});

})
//调用中间件封装的函数，调用可以传参(扩展性强）
app.use(reply());

app.listen(3000, err => {
    if (!err) console.log('服务器启动成功了~');
    else console.log(err);
})

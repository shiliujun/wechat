const express = require('express');
const reply = require('./reply');
const app = express();

//配置ejs
app.set('views','views');
app.set('view engine','ejs');

app.get('/search',(req,res)=>{

    res.render('search',{});

})
//调用中间件封装的函数，调用可以传参(扩展性强）
app.use(reply());

app.listen(3000, err => {
    if (!err) console.log('服务器启动成功了~');
    else console.log(err);
})

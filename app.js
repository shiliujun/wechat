const express = require('express');
const sha1=require('sha1');

const app = express();

app.use((req, res) => {
    console.log(req.query);

    const {signature, echostr, timestamp, nonce} = req.query;
    const token = 'dabaiya1128';

    const sortedArr=[token,timestamp,nonce].sort();

    const sha1Sorted= sha1(sortedArr.join(''));

    if (sha1Sorted===signature){
        res.end(echostr);
    } else {
        res.end(error);
    }
})

app.listen(3000, err => {
    if (!err) console.log('服务器启动成功了~');
    else console.log(err);
})

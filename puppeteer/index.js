const puppeteer = require('puppeteer');

(async () => {
    //打开浏览器
    const browser = await puppeteer.launch({
        headless: false
    });
    //新建标签页
    const page = await browser.newPage();
    //跳转指定网址
    await page.goto('https://movie.douban.com/cinema/nowplaying/shenzhen/',{
        waitUntil:['domcontentloaded']
    });
    //爬取所有正在热映的电影网址
    const result = await page.evaluate(() => {
        //抓取网页中的内容
        const $a = $('.lists>li .poster a');
        const result = [];
        $a.each(function (index, item) {
            result.push(item.href);
        })
        return result;
    });
    console.log(result);

    let movies=[];
    //爬取所有正在热映的电影详情
    for (let i = 0; i < result.length; i++) {
        const url = result[i];
        await page.goto(url);
        const deatil = await page.evaluate(() => {
            //电影标题
            const title = $('[property="v:itemreviewed"]').text();
            //电影评分
            const rating = $('[property="v:average"]').text();
            //电影海报
            const image = $('[rel="v:image"]').attr('src');

            return {
                title,
                rating,
                image
            };
        });
        movies.push(deatil);
    }
    console.log(movies);

    //关闭浏览器
    await browser.close();
})();
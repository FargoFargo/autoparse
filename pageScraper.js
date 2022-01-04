const scraperObject = {
    url: 'https://1xbet.whoscored.com/Matches//Live/',
    //pm2 start index.js --cron-restart="*/10 * * * *"
    async scraper(browser, fid){
        console.log(fid)
        const url2 = 'https://1xbet.whoscored.com/Matches/' + fid + '/Live/'
        let page = await browser.newPage();
        console.log(`Navigating to ${url2}...`);
        await page.goto(url2);

        await page.waitForSelector('.elapsed');
        let elapsed = await page.$eval('.elapsed', text => text.textContent);
        console.log("Elapsed is " + elapsed);
        let d = await page.$eval('body', text => {
            body = text.textContent;
            return body;
        });
        const matches = d.match(/matchCentreData\:\s(.*)\,\n?/i);
        const content = JSON.parse(matches[1]);
        if (content !== null && (elapsed === "F" || elapsed === "MS" || elapsed === "FT" || elapsed === "FIN")) {
            const axios = require('axios')
            const params = new URLSearchParams()
            params.append('content', JSON.stringify(content))
            axios({
                method: 'post',
                url: 'https://understat.com/parse/' + fid,
                data: params
            }).then(res => {
                console.log("Match has been parsed")
            })
            .catch(error => {
                console.log("Parsing error")
            })
        }
    }
}

module.exports = scraperObject;
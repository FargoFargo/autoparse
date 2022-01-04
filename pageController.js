const pageScraper = require('./pageScraper');
async function scrapeAll(browserInstance){
    let browser;
    try{
        browser = await browserInstance;
        const axios = require('axios')
        const schedule = await axios.post('https://understat.com/cp/getMatchesForParse')
        const matches = schedule.data.response.matches.filter((a) => a.status == -1)
        console.log("Load matches......");
        for (var i in matches) {
            const now = (new Date()).getTime()
            const timezoneOffset = -(new Date()).getTimezoneOffset() / 60	
            const dateTime = (new Date(matches[i].date)).getTime() + timezoneOffset * 3600 * 1000
            if ((dateTime + 2 * 3600 * 1000 - now) < 0){
                await pageScraper.scraper(browser, matches[i].fid); 
            }
            await timeout(20000);
        }   
    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = (browserInstance) => scrapeAll(browserInstance)
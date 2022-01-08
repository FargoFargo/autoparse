const puppeteer = require('puppeteer');

async function startBrowser(){
    let browser;
    try {
        console.log("Opening the browser......");
        browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                //'--single-process',
                '--disable-gpu',
                '--lang=en-US;q=0.5,en;q=0.3'
            ],
            //executablePath: "./node_modules/puppeteer/.local-chromium/linux-686378/chrome-linux/chrome",
            headless: true
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

module.exports = {
    startBrowser
};
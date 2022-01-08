const randomUseragent = require('random-useragent');

const scraperObject = {
    url: 'https://1xbet.whoscored.com/Matches//Live/',
    //pm2 start index.js --cron-restart="*/10 * * * *"
    async scraper(browser, fid){
        console.log(fid)
        const url2 = 'https://1xbet.whoscored.com/Matches/' + fid + '/Live/'
        /*let page = await browser.newPage();
        console.log(`Navigating to ${url2}...`);
        await page.goto(url2);*/
        const page = await init_page(browser);
		let response = await page.goto(url2);

        await page.waitForSelector('.elapsed');
        let elapsed = await page.$eval('.elapsed', text => text.textContent);
        console.log("Elapsed is " + elapsed);
        await page.waitForSelector('body');
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

const preparePageForTests = async (page) => {
    const userAgent = randomUseragent.getRandom();
	await page.setUserAgent(userAgent);
    await page.evaluateOnNewDocument(() => {
    	Object.defineProperty(navigator, 'webdriver', {
    	  	get: () => false,
    	});
    });
    await page.evaluateOnNewDocument(() => {
		window.chrome = {
			app: {
			  	isInstalled: false,
			},
			webstore: {
			  	onInstallStageChanged: {},
			  	onDownloadProgress: {},
			},
			runtime: {
			  	PlatformOs: {
					MAC: 'mac',
					WIN: 'win',
					ANDROID: 'android',
					CROS: 'cros',
					LINUX: 'linux',
					OPENBSD: 'openbsd',
			  	},
				PlatformArch: {
					ARM: 'arm',
					X86_32: 'x86-32',
					X86_64: 'x86-64',
				},
				PlatformNaclArch: {
					ARM: 'arm',
					X86_32: 'x86-32',
					X86_64: 'x86-64',
				},
				RequestUpdateCheckStatus: {
					THROTTLED: 'throttled',
					NO_UPDATE: 'no_update',
					UPDATE_AVAILABLE: 'update_available',
				},
				OnInstalledReason: {
					INSTALL: 'install',
					UPDATE: 'update',
					CHROME_UPDATE: 'chrome_update',
					SHARED_MODULE_UPDATE: 'shared_module_update',
				},
				OnRestartRequiredReason: {
					APP_UPDATE: 'app_update',
					OS_UPDATE: 'os_update',
					PERIODIC: 'periodic',
				},
			},
		};
	});
	await page.evaluateOnNewDocument(() => {
    	const originalQuery = window.navigator.permissions.query;
    	return window.navigator.permissions.query = (parameters) => (
    		parameters.name === 'notifications' ?
    		Promise.resolve({ state: Notification.permission }) :
    		originalQuery(parameters)
    	);
    });
    await page.evaluateOnNewDocument(() => {
    	Object.defineProperty(navigator, 'plugins', {
    		get: () => [1, 2, 3, 4, 5],
    	});
	});
    await page.evaluateOnNewDocument(() => {
		Object.defineProperty(navigator, 'language', {
    		get: () => 'en-US;q=0.5,en;q=0.3',
    	});
    	Object.defineProperty(navigator, 'languages', {
    		get: () => ['en-US;q=0.5', 'en;q=0.3'],
    	});
	});
};

const init_page = async (browser) => {
	const page = await browser.newPage();
	await page.setRequestInterception(true);
	page.on('request', request => {
		if (['image', 'media', 'font', 'stylesheet'].includes(request.resourceType())) 
			return request.abort();
		else
			request.continue();
	});
	await preparePageForTests(page);
	return page;
}

module.exports = scraperObject;
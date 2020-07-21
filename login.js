const puppeteer = require('puppeteer');

const profilesURL = require('./configs.json');
const manageCookies = require('./utils/manageCookies');

(async () => {
    for (let index = 0; index < profilesURL.length; index++) {
        const browser = await puppeteer.launch({
            headless: false
        });

        const [page] = await browser.pages();
        page.setViewport({ width: 1280, height: 720 });

        await page.goto('https://steamcommunity.com/login/home/?goto=');

        await page.waitForNavigation({ timeout: 0, waitUntil: "load" });
        await page.evaluate(() => Logout()).catch(err => console.log(err));

        await page.waitForNavigation({ timeout: 0, waitUntil: "load" });
        await page.goto('https://steamcommunity.com/login/home/?goto=');

        try {
            const checkboxInputSelector = 'input[name=remember_login]';
            await page.waitForSelector(checkboxInputSelector, { timeout: 15000 }).catch(err => { throw new Error(err) });
            await page.evaluate((checkboxInputSelector) => {
                const checkboxInput = document.querySelector(checkboxInputSelector);

                checkboxInput.checked = true;
            }, checkboxInputSelector);
        } catch (error) {
            console.log(error);
        }

        await page.waitForNavigation({ timeout: 0, waitUntil: "load" });
        await page.goto('https://www.idle-empire.com/earn/promotions');
        await page.waitForNavigation({ timeout: 0, waitUntil: "load" });
        // await page.waitForNavigation({ timeout: 0, waitUntil: "load" });

        await manageCookies.writeCookies(page, `./cookies/${index}-userdata.json`);
        await browser.close();
    }
})();

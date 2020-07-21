const fs = require("fs");

const writeLog = require('./writeLog');

module.exports = {
    async writeCookies(page, cookiesPath) {
        const client = await page.target().createCDPSession();
        // This gets all cookies from all URLs, not just the current URL
        const cookies = (await client.send("Network.getAllCookies"))["cookies"];

        console.log("Saving", cookies.length, "cookies");
        fs.writeFileSync(cookiesPath, JSON.stringify(cookies));
        // await fs.writeJSON(cookiesPath, cookies);
    },
    async restoreCookies(page, cookiesPath, profileIndex) {
        try {
            // const cookies = await fs.readJSON(cookiesPath);
            let buf = fs.readFileSync(cookiesPath);
            let cookies = JSON.parse(buf);
            await writeLog(profileIndex, `Loading ${cookies.length} cookies into browser`);
            await page.setCookie(...cookies);
        } catch (error) {
            await writeLog(profileIndex, `ERROR: Restore cookie error\n\t${error}`);
        }
    }
}


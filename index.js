const puppeteer = require('puppeteer');

const configs = require('./configs.json');
const getSteamName = require('./utils/getSteamName');
const changeSteamInfo = require('./utils/changeSteamInfo');
const getIdleEmpirePoints = require('./utils/getIdleEmpirePoints');
const withdrawIdleEmpirePoints = require('./utils/withdrawIdleEmpirePoints');
const resetSteamInfo = require('./utils/resetSteamInfo');
const writeLog = require('./utils/writeLog');
const manageCookies = require('./utils/manageCookies');

(async () => {
    const profilesURL = configs['profilesUrl'];

    profilesURL.forEach(async (profileURL, profileIndex) => {
        await openBrowserAndExecuteScript(profileURL, profileIndex);
    });
})();

async function openBrowserAndExecuteScript(profileURL, profileIndex) {
    const browser = await puppeteer.launch();

    try {
        await writeLog(profileIndex, 'STARTING SCRIPT');


        const [page] = await browser.pages();

        await manageCookies.restoreCookies(page, `./cookies/${profileIndex}-userdata.json`, profileIndex);

        const originalSteamName = await getSteamName(page, profileURL, profileIndex);
        await changeSteamInfo(page, profileURL, profileIndex);
        await getIdleEmpirePoints(page, profileIndex);
        await withdrawIdleEmpirePoints(page, profileIndex, configs.steamId);
        await resetSteamInfo(page, profileURL, originalSteamName, profileIndex);

        setTimeout(async () => {
            await writeLog(profileIndex, 'SCRIPT FINISHED');
        }, 2000);
    } catch (error) {
        await writeLog(profileIndex, `ERROR: SCRIPT ABORTED\n\t${error}`);
    } finally {
        await browser.close();
    }
}

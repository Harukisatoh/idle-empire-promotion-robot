const writeLog = require('./writeLog');

module.exports = async function (pageInstance, profileURL, profileIndex) {
    // Gets original name from steam user
    await pageInstance.goto(`${profileURL}/info`);

    try {
        const inputNameSelector = 'input[name=personaName]';

        await pageInstance.waitForSelector(inputNameSelector, { timeout: 5000 }).catch(err => { throw new Error(err) });
        const steamName = await pageInstance.evaluate((inputNameSelector) => document.querySelector(inputNameSelector).value, inputNameSelector);
        await writeLog(profileIndex, 'Original name saved');
        return steamName;
    } catch (error) {
        await writeLog(profileIndex, `ERROR: It wasn't possible to get the original name\n\t${error}`);
        return '';
    }
}

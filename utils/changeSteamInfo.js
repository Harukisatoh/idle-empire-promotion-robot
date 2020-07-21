const writeLog = require('./writeLog');

module.exports = async function (pageInstance, profileURL, profileIndex) {

    await changeSteamName(pageInstance, profileURL, profileIndex);
    await changeSteamAvatar(pageInstance, profileURL, profileIndex);

};

async function changeSteamName(pageInstance, profileURL, profileIndex) {
    await pageInstance.goto(`${profileURL}/info`);

    try {
        const nameInputSelector = 'input[name=personaName]';
        const submitButtonSelector = 'button.DialogButton._DialogLayout.Primary';

        await pageInstance.waitForSelector(nameInputSelector, { timeout: 15000 }).catch(err => { throw new Error(err) });
        await pageInstance.waitForSelector(submitButtonSelector, { timeout: 15000 }).catch(err => { throw new Error(err) });

        await pageInstance.evaluate(async (nameInputSelector, submitButtonSelector) => {
            const nameInput = document.querySelector(nameInputSelector);
            const submitButton = document.querySelector(submitButtonSelector);

            nameInput.value = `idle-empire.com`;
            submitButton.click();
        }, nameInputSelector, submitButtonSelector);

        await writeLog(profileIndex, 'Steam name changed to idle-empire name');
    } catch (error) {
        await writeLog(profileIndex, `ERROR: It wasn't possible to change steam name to idle-empire name\n\t${error}`);
    }
}

async function changeSteamAvatar(pageInstance, profileURL, profileIndex) {
    await pageInstance.goto(`${profileURL}/avatar`);

    try {
        const inputUploadHandlerSelector = 'input[type=file]';
        const submitButtonSelector = 'button.DialogButton._DialogLayout.Primary';

        await pageInstance.waitForSelector(inputUploadHandlerSelector, { timeout: 15000 }).catch(err => { throw new Error(err) });
        await pageInstance.waitForSelector(submitButtonSelector, { timeout: 15000 }).catch(err => { throw new Error(err) });

        const inputUploadHandler = await pageInstance.$(inputUploadHandlerSelector);
        await inputUploadHandler.uploadFile('./images/idle-empire.jpg');

        await pageInstance.evaluate(async (submitButtonSelector) => {
            const submitButton = document.querySelector(submitButtonSelector);
            submitButton.click();
        }, submitButtonSelector);

        await writeLog(profileIndex, 'Steam avatar changed to idle-empire avatar');
    } catch (error) {
        await writeLog(profileIndex, `ERROR: It wasn't possible to change steam avatar to idle-empire avatar\n\t${error}`);
    }
}

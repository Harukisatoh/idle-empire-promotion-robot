const writeLog = require('./writeLog');

module.exports = async function (pageInstance, profileURL, originalName, profileIndex) {
    await resetSteamName(pageInstance, profileURL, originalName, profileIndex);
    await resetSteamAvatar(pageInstance, profileURL, profileIndex);
}

async function resetSteamName(pageInstance, profileURL, originalName, profileIndex) {
    await pageInstance.goto(`${profileURL}/info`);

    try {
        const nameInputSelector = 'input[name=personaName]';
        const submitButtonSelector = 'button.DialogButton._DialogLayout.Primary';
        await pageInstance.waitForSelector(nameInputSelector, { timeout: 15000 }).catch(err => { throw new Error(err) });
        await pageInstance.waitForSelector(submitButtonSelector, { timeout: 15000 }).catch(err => { throw new Error(err) });

        await pageInstance.evaluate(async (originalName, nameInputSelector, submitButtonSelector) => {
            const nameInput = document.querySelector(nameInputSelector);
            const submitButton = document.querySelector(submitButtonSelector);

            nameInput.value = originalName;
            submitButton.click();
        }, originalName, nameInputSelector, submitButtonSelector);

        await writeLog(profileIndex, 'Steam original name reseted');

    } catch (error) {
        await writeLog(profileIndex, `ERROR: It wasn't possible to reset steam original name\n\t${error}`);
    }
}

async function resetSteamAvatar(pageInstance, profileURL, profileIndex) {
    await pageInstance.goto(`${profileURL}/avatar`, { waitUntil: 'networkidle0' });

    try {
        const previousAvatarDivSelector = 'div.DialogBody > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3)';
        const submitButtonSelector = 'button.DialogButton._DialogLayout.Primary';

        await pageInstance.waitForSelector(previousAvatarDivSelector, { timeout: 15000 }).catch(err => { throw new Error(err) });
        await pageInstance.waitForSelector(submitButtonSelector, { timeout: 15000 }).catch(err => { throw new Error(err) });

        await pageInstance.evaluate((previousAvatarDivSelector, submitButtonSelector) => {
            const previousAvatarDiv = document.querySelector(previousAvatarDivSelector);
            const submitButton = document.querySelector(submitButtonSelector);

            previousAvatarDiv.click();
            submitButton.click();
        }, previousAvatarDivSelector, submitButtonSelector);

        await writeLog(profileIndex, 'Steam original avatar reseted');
    } catch (error) {
        await writeLog(profileIndex, `ERROR: It wasn't possible to reset steam original avatar\n\t${error}`);
    }
}

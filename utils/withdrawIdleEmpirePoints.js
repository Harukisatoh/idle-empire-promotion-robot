const writeLog = require("./writeLog");

module.exports = async function (pageInstance, profileIndex, steamId) {
    await pageInstance.goto('https://www.idle-empire.com/withdraw/csgoshop-balance', { waitUntil: 'load' });

    const withdrawableBalance = await checkWithdrawability(pageInstance, profileIndex);

    if (withdrawableBalance) {
        await withdrawBalance(pageInstance, profileIndex, steamId);
    }
};

async function checkWithdrawability(pageInstance, profileIndex) {

    try {
        await writeLog(profileIndex, 'Checking points quantity');

        const pointsSpanSelector = '#user-balance';

        const pointsValue = await pageInstance.evaluate((pointsSpanSelector) => {
            const pointsSpan = document.querySelector(pointsSpanSelector);
            const pointsValue = parseInt(pointsSpan.innerText.replace(',', ''));

            return pointsValue;
        }, pointsSpanSelector);

        if (pointsValue >= 1000) {
            await writeLog(profileIndex, `You have ${pointsValue} points`);
            return true;
        } else {
            await writeLog(profileIndex, "You don't have enough points to withdraw");
            return false;
        }
    } catch (error) {
        await writeLog(profileIndex, `ERROR: It wasn't possible to check points, withdraw aborted\n\t${error}`);
        return false;
    }
}

async function withdrawBalance(pageInstance, profileIndex, steamId) {
    await writeLog(profileIndex, 'Trying to withdraw');

    try {
        const steamIdInputSelector = 'input[name=steamid]';
        const buttonSelector = 'button.btn.btn-primary';
        const errorSpanSelector = 'div.alert.alert-danger > span'; // role alert class alert alert-success

        await pageInstance.evaluate((buttonSelector) => {
            const withdraw1000PointsButton = document.querySelector(buttonSelector);
            withdraw1000PointsButton.click();
        }, buttonSelector);

        await pageInstance.waitFor(1000);

        await pageInstance.type(steamIdInputSelector, new String(steamId), { delay: 10 });
        await pageInstance.click(buttonSelector);

        await pageInstance.waitFor(1000);

        const retur = await pageInstance.evaluate((buttonSelector) => {
            const confirmButton = document.querySelector(buttonSelector);
            confirmButton.click();
        }, buttonSelector);

        await pageInstance.waitFor(1000);

        const errorMessage = await pageInstance.evaluate((errorSpanSelector) => {
            const errorSpan = document.querySelector(errorSpanSelector);

            if (errorSpan === null) {
                return null;
            } else {
                return errorSpan.innerText;
            }
        }, errorSpanSelector);

        if (errorMessage !== null) {
            throw new Error(errorMessage);
        } else {
            await writeLog(profileIndex, 'Succesfully withdrawn');
        }
    } catch (error) {
        await writeLog(profileIndex, `ERROR: It wasn't possible to withdraw your points\n\t${error}`);
    }

}

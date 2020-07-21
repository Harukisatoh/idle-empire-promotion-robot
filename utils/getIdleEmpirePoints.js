const writeLog = require('./writeLog');

module.exports = async function (pageInstance, profileIndex) {
    await pageInstance.goto('https://www.idle-empire.com/earn/promotions');
    await redeemNamePromotion(pageInstance, profileIndex);
    await redeemAvatarPromotion(pageInstance, profileIndex);
};

async function redeemNamePromotion(pageInstance, profileIndex) {

    try {
        const namePromotionButtonSelector = '#empire > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > button';
        const namePromotionSpanErrorSelector = '#empire > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > div.alert.alert-danger > span';

        await pageInstance.waitForSelector(namePromotionButtonSelector, { timeout: 15000 }).catch(err => { throw new Error(err) });

        await pageInstance.evaluate((namePromotionButtonSelector) => {
            const namePromotionButton = document.querySelector(namePromotionButtonSelector);
            namePromotionButton.click();
        }, namePromotionButtonSelector);

        await pageInstance.waitFor(1000);

        const errorMessage = await pageInstance.evaluate((namePromotionSpanErrorSelector) => {
            const errorSpan = document.querySelector(namePromotionSpanErrorSelector);

            if (errorSpan === null) {
                return null;
            } else {
                return errorSpan.innerText;
            }
        }, namePromotionSpanErrorSelector);

        if (errorMessage !== null) {
            throw new Error(errorMessage);
        } else {
            await writeLog(profileIndex, 'Name promotion redeemed');
        }

    } catch (error) {
        await writeLog(profileIndex, `ERROR: It wasn't possible to complete the name promotion\n\t${error}`);
    }
}

async function redeemAvatarPromotion(pageInstance, profileIndex) {
    try {
        const avatarPromotionButtonSelector = '#empire > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(6) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > button';
        const avatarPromotionSpanErrorSelector = '#empire > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(6) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > div.alert.alert-danger > span';

        await pageInstance.waitForSelector(avatarPromotionButtonSelector, { timeout: 15000 }).catch(err => { throw new Error(err) });

        await pageInstance.evaluate((avatarPromotionButtonSelector) => {
            const avatarPromotionButton = document.querySelector(avatarPromotionButtonSelector);

            avatarPromotionButton.click();
        }, avatarPromotionButtonSelector);

        await pageInstance.waitFor(1000);

        const errorMessage = await pageInstance.evaluate((avatarPromotionSpanErrorSelector) => {
            const errorSpan = document.querySelector(avatarPromotionSpanErrorSelector);

            if (errorSpan === null) {
                return null;
            } else {
                return errorSpan.innerText;
            }
        }, avatarPromotionSpanErrorSelector);

        if (errorMessage !== null) {
            throw new Error(errorMessage);
        } else {
            await writeLog(profileIndex, 'Avatar promotion redeemed');
        }

    } catch (error) {
        await writeLog(profileIndex, `ERROR: It wasn't possible to complete the avatar promotion\n\t${error}`);
    }
}

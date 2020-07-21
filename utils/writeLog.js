const fs = require('fs');

module.exports = async function writeLog(profileIndex, message) {
    const currentDateTime = new Date();

    const fullDate = currentDateTime.getDate() + '/' + (currentDateTime.getMonth() + 1) + '/' + currentDateTime.getFullYear();
    const fullTime = currentDateTime.getHours() + ':' + currentDateTime.getMinutes() + ':' + currentDateTime.getSeconds();
    const fullDateTime = fullDate + '-' + fullTime;

    await fs.appendFile(`./logs/${profileIndex}-log.log`, `[${fullDateTime}] ${message}\n`, function (err) {
        if (err) throw err;
    });
};

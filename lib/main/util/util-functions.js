const db = require('./sqlconnector.js')

function addDaysToDate(startDate, days) {
    let date = new Date(startDate);

    date.setDate(date.getDate() + days);

    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
}

async function calculateTrainingVariety(userID, startDate, range = 7) {
    if (range < 1 || range > 30 || !userID || !startDate) {
        return -1;
    }
    const endDate = addDaysToDate(startDate, range);
    let allExerciseIDs = new Set();

    const connectionDB = await db.connection;
    for (let date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
        let formattedDate = date.toISOString().split('T')[0];
        const query = `SELECT exerciseID FROM sets WHERE userID = '${userID}' AND Date = '${formattedDate}'`;

        await new Promise((resolve, reject) => {
            connectionDB.query(query, function (err, result) {
                if (err) {
                    console.error('Error querying database:', err);
                    return -1;
                } else {
                    if (result.length === 0) {
                        console.log(`${formattedDate}: Unable to find exercises.`);
                    } else {
                        console.log(`${formattedDate}`);
                        result.forEach(item => {
                            allExerciseIDs.add(BigInt(item.exerciseID));
                        });
                    }
                    resolve();
                }
            });
        });
    }
    console.log(allExerciseIDs);
    console.log(allExerciseIDs.size);
    return allExerciseIDs.size;
}


async function calculateWellnessStress(userID, startDate, range = 30) {
    if (range < 1 || !userID || !startDate) {
        return -1;
    }
    const endDate = addDaysToDate(startDate, range);
    let stressData = [];

    const connectionDB = await db.connection;
    for (let date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
        let formattedDate = date.toISOString().split('T')[0];
        const query = `SELECT stress FROM wellness WHERE userID = '${userID}' AND Date = '${formattedDate}'`;

        await new Promise((resolve, reject) => {
            connectionDB.query(query, async function (err, result) {
                if (err) {
                    console.error('Error querying database:', err);
                    reject(err);
                } else {
                    if (result.length === 0) {
                        console.log(`${formattedDate}: No wellness data found.`);
                    } else {
                        console.log(`${formattedDate}`);
                        result.forEach(item => {
                            stressData.push({ date: formattedDate, stress: item.stress });
                        });
                    }
                    resolve();
                }
            });
        });
    }
    console.log(stressData);
    return stressData;
}



module.exports = {
    calculateTrainingVariety,
    calculateWellnessStress
}
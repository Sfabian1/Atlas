const { Handler } = require("./handler");

class SetHandler extends Handler {

    static async GetSet(req, res) {
        const userID = req.params['userID'];
        const setID = req.params['setID'];

        if (!userID || !setID) {
            return res.status(400).json({ error: "Invalid userID or setID" });
        }

        try {
            // const result = await queryDatabase(`SELECT * FROM set WHERE user_id = ${userID} AND set_id = ${setID}`);
            
            // MOCK RESULT HERE
            const result = [
                {
                    set_id: 1,
                    exercise_id: 10,
                    user_id: 123,
                    workout_id: 456,
                    Date: "2023-10-23",
                    num_of_times: 3,
                    weight: 50,
                    weight_metric: "kg",
                    distance: 100,
                    distance_metric: "meters",
                    rep_time: "00:30",
                    rest_period: "00:45",
                    difficulty: "medium",
                    time_start: "09:00",
                    time_end: "10:00"
                }
            ]

            if (!result || result.length === 0) {
                return res.status(404).json({ error: "Set not found" });
            }

            if (result[0].user_id !== parseInt(userID)) {
                return res.status(401).json({ error: "Unauthorized UserID" });
            }

            return res.json(result[0]);

        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async ListSets(req, res) {
        const userID = req.params['userID'];
        const exerciseID = req.params['exerciseID'];

        if (!userID || !exerciseID) {
            return res.status(400).json({ error: "Invalid userID or exerciseID" });
        }
    
        try {
            // database function to fetch all sets associated with the given exerciseID.
            // const results = await queryDatabase(`SELECT * FROM set WHERE user_id = ${userID} AND exercise_id = ${exerciseID}`);
            
            // MOCK RESULTS
            const results = [
                {
                    set_id: 1,
                    exercise_id: exerciseID,
                    user_id: 123,
                    // ... other fields ...
                },
                {
                    set_id: 2,
                    exercise_id: exerciseID,
                    user_id: 123,
                }
            ];
    
            if (!results || results.length === 0) {
                return res.status(404).json({ error: "Not found: No sets associated with the given exerciseID" });
            }
    
            return res.json(results);
    
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async CreateSet(req, res) {
        const userID = req.params['userID'];
    
        if (!userID) {
            return res.status(403).json({ error: "Invalid userID" });
        }
    
        const {
            exercise_id, workout_id, Date, num_of_times, weight, weight_metric,
            distance, distance_metric, rep_time, rest_period, difficulty, time_start, time_end
        } = req.body;
    
        if (!exercise_id || !workout_id || !Date || !difficulty || !time_start) {
            return res.status(400).json({ error: "Bad request: Incomplete set data" });
        }
    
        const validDifficulties = ['easy', 'medium', 'hard', 'near_maximum', 'limit', 'failure'];
        const validWeightMetrics = ['lbs', 'kg', 'ton', 'tonne'];
        const validDistanceMetrics = ['feet', 'yards', 'miles', 'meters', 'kilometers'];
    
        if (!validDifficulties.includes(difficulty) || 
            (weight_metric && !validWeightMetrics.includes(weight_metric)) ||
            (distance_metric && !validDistanceMetrics.includes(distance_metric))) {
            return res.status(400).json({ error: "Bad request: Invalid difficulty, weight metric, or distance metric value" });
        }
    
        try {
            // Check if user exists through const userExists = await checkUserExists(userID);
            const userExists = userID === "123"; // Mock ID
            
            if (!userExists) {
                return res.status(404).json({ error: "UserID not foudn" });
            }
    
            // database function to insert the data and get the setID.
            // check if a similar set exists to throw a 409 error.
            // const setExists = await checkSetExists( ...conditions... );
            // if (setExists) {
            //     return res.status(409).json({ error: "Conflict: The set already exists" });
            // }
            
            const newSetID = Math.floor(Math.random() * 1000) + 1;  // Mock ID for now
    
            return res.status(200).json({ set_id: newSetID });
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    

    static async UpdateSet(req, res) {
        const userID = req.params['userID'];
        const setID = req.params['setID'];
    
        if (!userID || !setID) {
            return res.status(400).json({ error: "Invalid userID or setID" });
        }
    
        try {
            // Ensure that the set exists for the given setID and userID.
            // const setExists = await queryDatabase(`SELECT set_id FROM set WHERE set_id = ${setID} AND user_id = ${userID}`);
            
            // MOCK CHECK
            const setExists = setID === "1" && userID === "123";  // Replace this mock with actual database check.
    
            if (!setExists) {
                return res.status(404).json({ error: "No set with the given setID for the specified userID" });
            }
    
            // If set exists, then update the set.
            // update query based on the req.body information.
            // await queryDatabase(`UPDATE set SET ... WHERE set_id = ${setID} AND user_id = ${userID}`);
    
            return res.status(200).json({ message: "Set updated successfully" });
    
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    

    static async DeleteSet(req, res) {
        const userID = req.params['userID'];
        const setID = req.params['setID'];
    
        if (!userID || !setID) {
            return res.status(400).json({ error: "Invalid userID or setID" });
        }
    
        try {
            // ensure that the set exists for the given setID and userID.
            // const setExists = await queryDatabase(`SELECT set_id FROM set WHERE set_id = ${setID} AND user_id = ${userID}`);
            
            // MOCK CHECK
            const setExists = setID === "1" && userID === "123";  // Replace this mock with the actual database check.
    
            if (!setExists) {
                return res.status(404).json({ error: "No set with the given setID for the specified userID" });
            }
    
            // If set exists, then delete the set.
            // await queryDatabase(`DELETE FROM set WHERE set_id = ${setID} AND user_id = ${userID}`);
    
            return res.status(200).json({ message: "Set deleted successfully" });
    
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async AverageSet(req, res) {
        const userID = req.params['userID'];
        const exerciseID = req.params['exerciseID'];

        if (!userID || !exerciseID) {
            return res.status(400).json({ error: "Invalid userID or exerciseID" });
        }

        try {
            // Retrieve sets associated with the given exerciseID from the database.
            // const sets = await queryDatabase(`SELECT * FROM set WHERE user_id = ${userID} AND exercise_id = ${exerciseID}`);

            // MOCK RESULTS
            const sets = [
                {
                    set_id: 1,
                    exercise_id: exerciseID,
                    user_id: 123,
                    workout_id: 456,
                    Date: "2023-10-23",
                    num_of_times: 3,
                    weight: 50,
                    weight_metric: "kg",
                    distance: 100,
                    distance_metric: "meters",
                    rep_time: "00:30",
                    rest_period: "00:45",
                    difficulty: "medium",
                    time_start: "09:00",
                    time_end: "10:00"
                },
                {
                    set_id: 2,
                    exercise_id: exerciseID,
                    user_id: 123,
                    workout_id: 456,
                    Date: "2023-10-24",
                    num_of_times: 2,
                    weight: 40,
                    weight_metric: "kg",
                    distance: 120,
                    distance_metric: "meters",
                    rep_time: "00:35",
                    rest_period: "00:50",
                    difficulty: "hard",
                    time_start: "09:30",
                    time_end: "10:30"
                }
            ];

            if (!sets || sets.length === 0) {
                return res.status(404).json({ error: "Not found: No sets associated with the given exerciseID" });
            }

            // Calculate the average values for each field.
            const averageSet = {
                exercise_id: exerciseID,
                user_id: userID,
                num_of_times: sets.reduce((acc, set) => acc + set.num_of_times, 0) / sets.length,
                weight: sets.reduce((acc, set) => acc + set.weight, 0) / sets.length,
                distance: sets.reduce((acc, set) => acc + set.distance, 0) / sets.length,
                rep_time: sets.reduce((acc, set) => acc + set.rep_time, 0) / sets.length,
                rest_period: sets.reduce((acc, set) => acc + set.rest_period, 0) / sets.length,
                difficulty: "", 
            };

            return res.json(averageSet);

        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async MaxSet(req, res) {
    const userID = req.params['userID'];
    const exerciseID = req.params['exerciseID'];

    if (!userID || !exerciseID) {
        return res.status(400).json({ error: "Invalid userID or exerciseID" });
    }

    try {
        // Retrieve sets associated with the given exerciseID from the database.
        // const sets = await queryDatabase(`SELECT * FROM set WHERE user_id = ${userID} AND exercise_id = ${exerciseID}`);

        // MOCK RESULTS
        const sets = [
            {
                set_id: 1,
                exercise_id: exerciseID,
                user_id: 123,
                workout_id: 456,
                Date: "2023-10-23",
                num_of_times: 3,
                weight: 50,
                distance: 100,
                rep_time: "00:30",
                rest_period: "00:45",
            },
            {
                set_id: 2,
                exercise_id: exerciseID,
                user_id: 123,
                workout_id: 456,
                Date: "2023-10-24",
                num_of_times: 5,
                weight: 60,
                distance: 120,
                rep_time: "00:25",
                rest_period: "00:40",
            },
        ];

        if (!sets || sets.length === 0) {
            return res.status(404).json({ error: "Not found: No sets associated with the given exerciseID" });
        }

        // Calculate the maximum values for each field.
        const maxSet = {
            exercise_id: exerciseID,
            user_id: userID,
            num_of_times: Math.max(...sets.map((set) => set.num_of_times)),
            weight: Math.max(...sets.map((set) => set.weight)),
            distance: Math.max(...sets.map((set) => set.distance)),
            rep_time: formatTime(Math.max(...sets.map((set) => parseTime(set.rep_time))),
            rest_period: formatTime(Math.max(...sets.map((set) => parseTime(set.rest_period))),
        };

        return res.json(maxSet);

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
}


    static async MedianSet(req, res) {
        const userID = req.params['userID'];
        const exerciseID = req.params['exerciseID'];

        if (!userID || !exerciseID) {
            return res.status(400).json({ error: "Invalid userID or exerciseID" });
        }

        try {
            // Retrieve sets associated with the given exerciseID from the database.
            // const sets = await queryDatabase(`SELECT * FROM set WHERE user_id = ${userID} AND exercise_id = ${exerciseID}`);

            // MOCK RESULTS
            const sets = [
                {
                    set_id: 1,
                    exercise_id: exerciseID,
                    user_id: 123,
                    workout_id: 456,
                    Date: "2023-10-23",
                    num_of_times: 3,
                    weight: 50,
                    distance: 100,
                    rep_time: "00:30",
                    rest_period: "00:45",
                },
                {
                    set_id: 2,
                    exercise_id: exerciseID,
                    user_id: 123,
                    workout_id: 456,
                    Date: "2023-10-24",
                    num_of_times: 2,
                    weight: 40,
                    distance: 120,
                    rep_time: "00:35",
                    rest_period: "00:50",
                },
            ];

            if (!sets || sets.length === 0) {
                return res.status(404).json({ error: "Not found: No sets associated with the given exerciseID" });
            }

            // Calculate the median values for each field.
            const medianSet = {
                exercise_id: exerciseID,
                user_id: userID,
                num_of_times: calculateMedian(sets.map((set) => set.num_of_times)),
                weight: calculateMedian(sets.map((set) => set.weight)),
                distance: calculateMedian(sets.map((set) => set.distance)),
                rep_time: calculateMedianTime(sets.map((set) => parseTime(set.rep_time))),
                rest_period: calculateMedianTime(sets.map((set) => parseTime(set.rest_period))),
            };

            return res.json(medianSet);

        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    function calculateMedian(arr) {
        const sortedArr = arr.slice().sort((a, b) => a - b);
        const mid = Math.floor(sortedArr.length / 2);

        if (sortedArr.length % 2 === 0) {
            return (sortedArr[mid - 1] + sortedArr[mid]) / 2;
        } else {
            return sortedArr[mid];
        }
    }

    function calculateMedianTime(timeArray) {
        const sortedTimes = timeArray.slice().sort((a, b) => a - b);
        const mid = Math.floor(sortedTimes.length / 2);

        if (sortedTimes.length % 2 === 0) {
            return formatTime((sortedTimes[mid - 1] + sortedTimes[mid]) / 2);
        } else {
            return formatTime(sortedTimes[mid]);
        }
    }
}

module.exports = { SetHandler };

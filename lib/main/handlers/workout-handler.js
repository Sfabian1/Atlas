class WorkoutHandler {

    static async ListWorkouts(req, res) {

                const userID = req.params.userID;

        if (!userID) {
            return res.status(400).json({ error: "Invalid userID" });
        }
        
        try {
            // const workouts = await queryDatabase('SELECT * FROM workout WHERE user_id = :userID', { userID });
            // Mock list of workouts for testing
            const workouts = [
                {
                    userID : 123,
                    workoutID: 1,
                    exercise: "Squats",
                    sets: 3,
                    reps: 10,
                    weight: 70,
                    date: "2023-10-23"
                },
                {
                    userID: 123,
                    workoutID: 2,
                    exercise: "Push-ups",
                    sets: 4,
                    reps: 15,
                    weight: null,
                    date: "2023-10-24"
                },
                {
                    userID: 123,
                    workoutID: 3,
                    exercise: "Deadlifts",
                    sets: 5,
                    reps: 8,
                    weight: 225,
                    date: "2023-10-25"
                }
                
            ];

            const userWorkouts = workouts.filter(workout => workout.userID === parseInt(userID));

            return res.json(userWorkouts);

        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async GetWorkout(req, res) {
        const userID = req.params.userID;
        const workoutID = req.params.workoutID;

        if (!userID || !workoutID) {
            return res.status(400).json({ error: "Invalid userID or workoutID" });
        }

        try {
            //const result = await queryDatabase(`SELECT * FROM workout WHERE user_id = ${userId} AND workout_id = ${workoutId}`);
            
            //MOCK RESULT HERE, ??? put your own data here
            const result = [
                {
                  userID: 123,
                  workoutID: 1,
                  exercise: "Squats",
                  sets: 3,
                  reps: 10,
                  weight: 70,
                  date: "2023-10-23"
                }
            ]

            if (!result || result.length === 0) {
                return res.status(404).json({ error: "Workout not found" });
            }

            if (result[0].userID !== parseInt(userID)) {
                return res.status(401).json({ error: "Unauthorized UserID" });
            }

            return res.json(result[0]);

        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });  //Some general catchall error
        }
    }

    static async CreateWorkout(req, res) {

        const userID = req.params.userID;
    
        if (!userID) {
            return res.status(401).json({ error: "Unauthorized: Invalid userID" });
        }
    
        const { name, difficulty, timeStart, timeEnd, date, status } = req.body;
    
        if (JSON.stringify(req.body).length > 10000) {  // arbitrary limit
            return res.status(413).json({ error: "Payload too large" });
        }
    
        if (!name || !difficulty || !timeStart || !date || !status) {
            return res.status(422).json({ error: "Incomplete workout data" });
        }
    
        if ((status !== 'IN_PROGRESS' || status !== 'STARTED') && !timeEnd) {
            return res.status(422).json({ error: "timeEnd is required unless status is IN_PROGRESS" });
        }
    
        const validDifficulties = ['easy', 'medium', 'hard', 'near_maximum', 'limit', 'failure'];
        const validStatuses = ['IN_PROGRESS', 'COMPLETED', 'STARTED'];
    
        if (!validDifficulties.includes(difficulty) || !validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid difficulty or status value" });
        }
    
        try {
            // Call a database function here to insert the data and get the workoutID.
            const newWorkoutID = Math.floor(Math.random() * 1000) + 1;  // Mock ID
            
            return res.status(200).json({ workoutID: newWorkoutID });
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async UpdateWorkout(req, res) {
      const userID = req.params.userID;
      const workoutID = req.params.workoutID;
      const requestBody = req.body;
  
      if (!userID || !workoutID) {
        return res.status(400).json({ error: "Invalid userID or workoutID" }); // error 400
      }
  
      try {
        const workout = workouts.find(
          (w) =>
            w.userID === parseInt(userID) && w.workoutID === parseInt(workoutID)
        );
  
        if (!workout) {
          return res.status(404).json({ error: "Workout not found" }); // error 404
        }
  
        if (workout.userID !== parseInt(userID)) {
          return res.status(401).json({ error: "Unauthorized UserID" }); // error 401
        }
        // updates field
        if (requestBody.sets !== undefined) {
          workout.sets = requestBody.sets;
        }
        if (requestBody.reps !== undefined) {
          workout.reps = requestBody.reps;
        }
        if (requestBody.weight !== undefined) {
          workout.weight = requestBody.weight;
        }
        if (requestBody.date !== undefined) {
          workout.date = requestBody.date;
        }
  
        return res.json(workout);
      } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" }); // error 500
      }
    

    }

    static async DeleteWorkout(req, res) {
        
    }
}

module.exports = { WorkoutHandler };




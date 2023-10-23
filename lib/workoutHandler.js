class WorkoutHandler {

    static async ListWorkouts(req, res) {
        
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
        
    }

    static async UpdateWorkout(req, res) {
        
    }

    static async DeleteWorkout(req, res) {
        
    }
}

module.exports = { WorkoutHandler };




const { Handler } = require("./handler");

class ExerciseHandler extends Handler{

	static async CreateExercise(req, res) {
		try {
		const userID = req.params.userID;
		if(!userID) {
			return res.status(404).json({ error: "Resource not found exception"});
		}
		const {exercise_id, name, target_muscle_group, force, rest_interval, progression, link} = req.body;
		if(JSON.stringify(req.body).length > 10000) {
			return res.status(413).json({ error: "Payload too large"});
		}
		if(!name || !target_muscle_group|| !force || !rest_interval || !progression || !link){
			return res.status(400).json({ error: "Validation exception"});
		}

		const exerciseExists = await queryDatabase("EXISTS (SELECT name FROM exercise WHERE name = ${name})");
		if(exerciseExists) {
			return res.status(409).JSON({ error: "Conflict exception"});
		}
		await queryDatabase("INSERT INTO exercise (user_id, exercise_id, name, target_muscle_group, force, rest_interval, progression, link) VALUES (${userID}, ${exercise_id}, ${name}, ${target_muscle_group}, ${force}, ${rest_interval}, ${progression}, ${link})");
		} catch (error) {
			return res.status(500).json({error: "Internal server error"});
		}
		return res.status(200).json({success: "Success"});
	}
	
	static async ListExercises(req, res) {
		try {
		const userID = req.params.userID;
		if(!userID) {
			return res.status(404).json({ error: "Resource not found exception"});
		}
		const exercises_req = await queryDatabase("SELECT exercise_id FROM exercise WHERE user_id = ${userID})");
		} catch (error){
			return res.status(500).json({error: "Internal server error"});
		}
		return res.status(200).json({message: JSON.stringify(exercises_req)});
	}

	static async UpdateExercise(req, res) {
		try {
		const userID = req.params.userID;
		const exercise_id = req.params.exercise_id;
		if(!userID || !exercise_id) {
			return res.status(404).json({error: "Resource not found exception"});
		}
		const exercise_req = await queryDatabase("SELECT * FROM exercise WHERE user_id = ${userID} and exercise_id = ${exercise_id}");
		if(!exercise_req) {
			return res.status(400).json({error: "Bad Request"});
		}
		} catch (error) {
			return res.status(500).json({error: "Internal server error"});
		}
		return res.status(200).json({exercise: JSON.stringify(exercise_req)});
	}

	static async DeleteExercise(req, res) {
		try {
		const userID = req.params.["userID"];
		const exercise_id = req.params["exercise_id"];
		if(!userID || !exercise_id) {
			return res.status(404).json({error: "Resource not found exception"});
		}
		const exerciseExists = await queryDatabase("SELECT exercise_id FROM exercise WHERE exercise_id = ${exercise_id} AND user_id = ${userID}");
		if(!exerciseExists) {
			return res.status(404).json({error: "Resource not found exception"});
		}
			await queryDatabase("DELETE FROM exercise WHERE exercise_id = ${exercise_id} AND user_id = ${userID}");
		} catch (error) {
			return res.status(500).json({error: "Internal server error"});
		}
		return res.status(200).json({message: "Exercise deleted successfully"});
}

module.exports = { ExerciseHandler };

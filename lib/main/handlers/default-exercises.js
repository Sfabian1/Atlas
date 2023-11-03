const { Handler } = require("./handler");
const ExerciseHandler = require('./ExerciseHandler');
const db = require('../util/sqlconnector.js');
const ErrorHandler = require('../util/error-handler.js')
const genUUID = require('../util/util.js')
const {
  ValidationException,
  ResourceNotFoundException,
  AccessDeniedException
} = require('../util/exceptions.js');
const { 
  CompletedResponse
} = require('../util/response');

async function populateDefaultExercises() {
  try {
    const userURL = req.url.split('/');
		const userID = userURL[1];
    const exerciseHandler = new ExerciseHandler(); // creates instance of ExerciseHandler.

    // mock default exercises
    const defaultExercises = [
      {
        exercise_id: 1,
        user_id: 123,
        name: 'Leg Extension',
        target_muscle_group: 'quadriceps',
        force: 'push',
        rest_interval: 120,
        progression: 'weight',
        link: 'https://example.com/exercise1'
      },
      {
        exercise_id: 2,
        user_id: 123,
        name: 'Calf Raise',
        target_muscle_group: 'calves',
        force: 'push',
        rest_interval: 120,
        progression: 'weight',
        link: 'https://example.com/exercise2'
      },
      {
        exercise_id: 3,
        user_id: 456,
        name: 'Lat Pulldown',
        target_muscle_group: 'lats',
        force: 'pull',
        rest_interval: 120,
        progression: 'weight',
        link: 'https://example.com/exercise3'
      }
    ];

    for (const exerciseData of defaultExercises) {
      const req = {url: userID}; // simulate request object to pass to CreateExercise.
      exerciseHandler.postValue = JSON.stringify(exerciseData); // set the postValue with the JSON string of the exercise data.
      const result = await exerciseHandler.CreateExercise(req); // use CreateExercise function to add the exercise to the database.
      console.log(result);
    }

  } catch (error) {
    console.error(error);
  }
}

async function listExercises() {
  try {
    const userURL = req.url.split('/');
		const userID = userURL[1];
    const exerciseHandler = new ExerciseHandler(); // creates instance of ExerciseHandler.

    // list default exercises.
    const listReq = {url: userID};
    const listResult = await exerciseHandler.ListExercises(listReq);
    console.log(listResult);
  } catch (error) {
    console.error(error);
  }
}

populateDefaultExercises(); // function call to populate default exercises.
listExercises(); // function call to list default exercises.
document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch and display set information by set ID
    const USER_ID_KEY = "userID";
    const userID = getIdFromCache(USER_ID_KEY);
    function getIdFromCache(idKey) {
        return parseInt(localStorage.getItem(idKey)) || 0;
    }
    console.log('userID from local storage:', userID);

    const urlParams = new URLSearchParams(window.location.search);
    const setID = urlParams.get('setID');

// Function to fetch exercise name by exercise ID
async function fetchExerciseName(exerciseID) {
    try {
        const response = await fetch('http://localhost:8000/' + userID + '/exercise/' + exerciseID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error fetching workout name: ${response.statusText}`);
        }
        const exercise = await response.json();

        // Log the workout data to check if it contains the name
        console.log('Fetched Exercise Data:', exercise);
        
        const exerciseName = exercise[0].name;

        return exerciseName;
    } catch (error) {
        console.error(error);
        return 'Exercise Name Not Found';
    }
}

// Function to fetch workout name by workout ID
async function fetchWorkoutName(workoutID) {
    try {
        const response = await fetch('http://localhost:8000/' + userID + '/workouts/' + workoutID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error fetching workout name: ${response.statusText}`);
        }
        const workout = await response.json();

        // Log the workout data to check if it contains the name
        console.log('Fetched Workout Data:', workout);
        
        const workoutName = workout[0].name;

        return workoutName;
    } catch (error) {
        console.error(error);
        return 'Workout Name Not Found';
    }
}

// Update the fetchSetInfo function to use the new functions
async function fetchSetInfo(setID) {
    try {
        const url = 'http://localhost:8000/' + userID + '/sets/' + setID;
        console.log('Fetching data from URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`Error fetching set information: ${response.statusText}`);
        }

        

        const setInfo = await response.json();
        const exerciseName = await fetchExerciseName(setInfo[0].exerciseID);
        const workoutName = await fetchWorkoutName(setInfo[0].workoutID);
        console.log('Set Information:', setInfo);
        const datepart = setInfo[0].Date.split('T');
        const datee = datepart[0];

        // Populate HTML elements with set information
        document.getElementById('workoutName').textContent = workoutName; // Name of the workout
        document.getElementById('exerciseName').textContent = exerciseName; // Name of the exercise
        document.getElementById('date').textContent = datee;
        document.getElementById('numOfTimes').textContent = setInfo[0].num_of_times;
        document.getElementById('metric').textContent = setInfo[0].metric;
        document.getElementById('unit').textContent = setInfo[0].unit;
        document.getElementById('metricValue').textContent = setInfo[0].metric_value;
        document.getElementById('repTime').textContent = setInfo[0].rep_time;
        document.getElementById('restPeriod').textContent = setInfo[0].rest_period;
        document.getElementById('difficulty').textContent = setInfo[0].difficulty;
        document.getElementById('timeStart').textContent = setInfo[0].time_start;
        document.getElementById('timeEnd').textContent = setInfo[0].time_end;
        document.getElementById('rpe').textContent = setInfo[0].rpe;
        // ... (populate other fields as before)

    } catch (error) {
        console.error(error);
        alert('Error fetching set information.');
    }
}


if (setID) {
    fetchSetInfo(setID);
} else {
    alert('Set ID not provided.');
}
});




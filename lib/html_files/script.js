document.addEventListener('DOMContentLoaded', function() {
    const USER_ID_KEY = "userId";

    const userID = getIdFromCache(USER_ID_KEY);
    function getIdFromCache(idKey) {
        return parseInt(localStorage.getItem(idKey)) || 0;
    }


    let currentSetId = null; // for setID to upate
    const setForm = document.getElementById('setForm');
    const dateInput = document.getElementById('date');
    const metricSelect = document.getElementById('metric');
    const unitSelect = document.getElementById('unit');
    const beginButton = document.getElementById('begin');
    const restButton = document.getElementById('rest');
    const endButton = document.getElementById('end');
    const setInfoDisplay = document.getElementById('setInfoDisplay');
    const startTimeDisplay = document.createElement('p');
    const endTimeDisplay = document.createElement('p');
    const nextSetButton = document.getElementById('nextSet');
    let repTimeCountdownInterval; // Variable to store repTime countdown
    let restPeriodCountdownInterval; // Variable to store restPeriod countdown
    // Set the date input to today's date
    dateInput.valueAsDate = new Date();
    let currentSet = 0;
    let totalSets = 0;

    const repTimeInput = document.getElementById('repTime');
    const restPeriodInput = document.getElementById('restPeriod');

    if (!repTimeInput.value) {
        repTimeInput.value = '00:00:00';
    }

    if (!restPeriodInput.value) {
        restPeriodInput.value = '00:00:00';
    }

    // Fill rpe, I just did up to 10 for now but u can change if u want
    const rpeSelect = document.getElementById('rpe');
    for (let i = 1; i <= 10; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = i;
        rpeSelect.appendChild(option);
    }
    
    async function fetchExercises() {
        try {
            const response = await fetch('http://localhost:8000/'+ userID + '/exercises', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.ok) {
                const exercises = await response.json();
                populateExerciseDropdown(exercises);
            } else {
                // Handle errors
                console.error('Failed to fetch exercises');
            }
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    }

    function populateExerciseDropdown(exercises) {
        const exerciseDropdown = document.getElementById('exercise');
        
    
        // default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Exercise';
        exerciseDropdown.appendChild(defaultOption);
    
        exercises.forEach(exercise => {
            const option = document.createElement('option');
            option.value = exercise.exerciseID; // exerciseID
            option.textContent = exercise.name; // name
            exerciseDropdown.appendChild(option);
        });
    }


    async function fetchWorkouts() {
        try {
            const response = await fetch('http://localhost:8000/'+ userID + '/workouts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                const workouts = await response.json();
                populateWorkoutDropdown(workouts.filter(workout => workout.status === 'IN_PROGRESS'));
            } else {
                console.error('Failed to fetch workouts');
            }
        } catch (error) {
            console.error('Error fetching workouts:', error);
        }
    }
    
    function populateWorkoutDropdown(workouts) {
        const workoutDropdown = document.getElementById('workoutDropdown'); 
        workoutDropdown.innerHTML = '';
    
        if (workouts.length === 0) {
            // If there are no IN_PROGRESS workouts, create a disabled option
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No Workouts in Progress Currently';
            option.disabled = true;
            workoutDropdown.appendChild(option);
        } else {
            workouts.forEach(workout => {
                const option = document.createElement('option');
                option.value = workout.workoutID;
                option.textContent = workout.name;
                workoutDropdown.appendChild(option);
            });
        }
    }
    

    async function initializeDropdowns() {
        await fetchExercises();
        await fetchWorkouts();
    }
    
    initializeDropdowns();

    // Units to correspond to metric chosen
(function updateUnitOptions() {
    const metricSelect = document.getElementById('metric');
    const unitSelect = document.getElementById('unit');
    const valueInput = document.getElementById('value'); 

    function updateOptions() {
        unitSelect.innerHTML = ''; // Clear current unit options
        
        const unitsByMetric = {
            'None': [],
            'Weight': ['lbs', 'kg', 'ton', 'tonne'],
            'Distance': ['feet', 'yards', 'miles', 'meters', 'kilometers']
        };
        
        const selectedMetric = metricSelect.value;
        const units = unitsByMetric[selectedMetric] || [];
        
        // Populate unit options for the metric chosen
        units.forEach(unit => {
            let option = document.createElement('option');
            option.value = unit;
            option.text = unit;
            unitSelect.appendChild(option);
        });


        valueInput.disabled = selectedMetric === 'None';
        unitSelect.disabled = selectedMetric === 'None';
    }


    metricSelect.addEventListener('change', updateOptions);


    updateOptions();
})(); 


function startCountdown(inputId, timerType) {
    const inputField = document.getElementById(inputId);
    const timerDisplay = document.getElementById('timerDisplay'); 
    let [hours, minutes, seconds] = inputField.value.split(':').map(Number);
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const countdownTimer = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(countdownTimer);
            timerDisplay.textContent = '00:00:00';
           /* if (timerType === 'rep') {
                startRestTimeCountdown(); // Automatically start rest period when rep time ends. I dont think it should but we can uncomment this if we want it to.
            } */
        } else {
            totalSeconds--;
            let countdownHours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
            let remainder = totalSeconds % 3600;
            let countdownMinutes = Math.floor(remainder / 60).toString().padStart(2, '0');
            let countdownSeconds = (remainder % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${countdownHours}:${countdownMinutes}:${countdownSeconds}`;
        }
    }, 1000);

    return countdownTimer;
}


document.getElementById('startRepTime').addEventListener('click', function() {
    startCountdown('repTime', 'repTimeDisplay'); 
});

document.getElementById('startRestPeriod').addEventListener('click', function() {
    startCountdown('restPeriod', 'restPeriodDisplay'); 
});


function startRepTimeCountdown() {
    if (restPeriodCountdownInterval) clearInterval(restPeriodCountdownInterval); 
    if (repTimeCountdownInterval) clearInterval(repTimeCountdownInterval); 
    repTimeCountdownInterval = startCountdown('repTime', 'rep');
}

function startRestTimeCountdown() {
    if (repTimeCountdownInterval) clearInterval(repTimeCountdownInterval); 
    if (restPeriodCountdownInterval) clearInterval(restPeriodCountdownInterval);
    restPeriodCountdownInterval = startCountdown('restPeriod', 'rest');
}

function toggleTimerDisplay(timerId, show) {
    const timer = document.getElementById(timerId);
    timer.style.display = show ? 'block' : 'none';
}





    // BEGIN button functionality
    beginButton.addEventListener('click', function() {
        const formData = new FormData(setForm);
        const setData = {
            exerciseID: document.getElementById('exercise').value, 
            workoutID: document.getElementById('workoutDropdown').value, 
            Date: document.getElementById('date').value, 
            num_of_times: parseInt(document.getElementById('sets').value, 10),
            unit: document.getElementById('metric').value === 'None' ? null : document.getElementById('unit').value, // If no metric is selected, unit is empty
            metric: document.getElementById('metric').value.toLowerCase(), 
            metric_value: document.getElementById('metric').value === 'None' ? null : parseFloat(document.getElementById('value').value), // If no metric is selected, metric value is null
            rep_time: document.getElementById('repTime').value, // format is HH:MM:SS
            rest_period: document.getElementById('restPeriod').value, //format is HH:MM:SS
            difficulty: document.getElementById('difficulty').value,
            time_start: new Date().toLocaleTimeString('en-GB', { hour12: false }), // time in 24-hour format
            time_end: "", // Placeholder
            rpe: parseInt(document.getElementById('rpe').value, 10) // Converted to integer incase
        };
      console.log(setData.metric);  

    
        // Convert to YYYY-MM-DD format 
        if (setData.date) {
            const date = new Date(setData.date);
            setData.date = date.toISOString().split('T')[0];
        }

        const setsInput = document.getElementById('sets');
        totalSets = parseInt(setsInput.value) || 0;
        currentSet = 1; // Start the first set


        startRepTimeCountdown();

        // Hide BEGIN button, show REST and END buttons
        beginButton.style.display = 'none';
        restButton.style.display = 'inline-block';
        endButton.style.display = 'inline-block';

        

        createSet(setData);
    });
    

    async function createSet(setData) {
        try {
            console.log('Sending set data:', setData); 
            const response = await fetch('http://localhost:8000/'+ userID + '/sets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(setData)
            });
    
            try {
                const jsonResponse = await response.json();
                if (response.ok) {
                    console.log('Set created successfully:', jsonResponse);
                    console.log(jsonResponse);
                    currentSetId = jsonResponse; 
                } else {
                    console.error('Set creation failed:', jsonResponse);
                }
            } catch (parseError) {
                console.error('Error parsing JSON response:', parseError);
                console.error('Full response:', response);
            }
        } catch (error) {
            console.error('Error sending set data:', error);
        }
    }
    
    

      // REST button functionality
      restButton.addEventListener('click', function() {
        startRestTimeCountdown();

        if (currentSet < totalSets) {
            nextSetButton.style.display = 'inline-block'; // Show Next Set button
        } else {
            endButton.click(); // Automatically click END once all sets are completed
        }
    });

    async function updateEndTime(setId) {
        const endTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
        const data = { time_end: endTime };
    
        try {
            const response = await fetch(`http://localhost:8000/${userID}/sets/${setId}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data) // Send the new end time in the request body
            });
    
            const jsonResponse = await response.json();
            if (response.ok) {
                console.log('End time updated successfully:', jsonResponse);
            } else {
                console.error('Failed to update end time:', jsonResponse);
            }
        } catch (error) {
            console.error('Error sending end time update:', error);
        }
    }
    
    // END button functionality
    endButton.addEventListener('click', function() {
        if (repTimeCountdownInterval) clearInterval(repTimeCountdownInterval);
        if (restPeriodCountdownInterval) clearInterval(restPeriodCountdownInterval);

        if (repTimeCountdownInterval) clearInterval(repTimeCountdownInterval);
        if (restPeriodCountdownInterval) clearInterval(restPeriodCountdownInterval);
        document.getElementById('timerDisplay').textContent = '00:00:00'; // Reset the display to 00:00:00

        endTimeDisplay.textContent = `End Time: ${new Date().toLocaleTimeString()}`;
        setInfoDisplay.appendChild(endTimeDisplay);

        if (currentSetId) {
            updateEndTime(currentSetId); 
        }
        beginButton.style.display = 'inline-block';
        restButton.style.display = 'none';
        endButton.style.display = 'none';
        nextSetButton.style.display = 'none';
    });

    nextSetButton.addEventListener('click', function() {
        currentSet++;
        startRepTimeCountdown(); // Start the next set's rep time countdown
        nextSetButton.style.display = 'none'; 
    });

    // Initially hide REST and END buttons
    restButton.style.display = 'none';
    endButton.style.display = 'none';
    document.getElementById('repTimeDisplay').style.display = 'none';
document.getElementById('restPeriodDisplay').style.display = 'none';


});

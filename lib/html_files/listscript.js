document.addEventListener('DOMContentLoaded', function() {
    const setsContainer = document.getElementById('setsContainer');
    const createSetBtn = document.getElementById('createSetBtn');
    const USER_ID_KEY = "userID";
    const userID = getIdFromCache(USER_ID_KEY);
    function getIdFromCache(idKey) {
        return parseInt(localStorage.getItem(idKey)) || 0;
    }

    async function fetchSets() {
        try {
            const response = await fetch('http://localhost:8000/' + userID + '/sets', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching sets: ${response.statusText}`);
            }
            const sets = await response.json();
            return sets;
        } catch (error) {
            console.error(error);
            return [];
        }
    }


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

        console.log('Fetched Workout Data:', workout);
        
        const workoutName = workout[0].name;

        return workoutName;
    } catch (error) {
        console.error(error);
        return 'Workout Name Not Found';
    }
}


    async function renderSets(sets) {
        for (const set of sets) {
            
            const dateParts = set.Date.split('T');
            const date = dateParts[0]; 

          
            const workoutName = await fetchWorkoutName(set.workoutID);

            const setDiv = document.createElement('div');
            setDiv.classList.add('set');
            setDiv.innerHTML = `
                <h2>Set Information</h2>
                <p>Date: ${date}</p>
                <p>Time Start: ${set.time_start}</p>
                <p>Time End: ${set.time_end}</p>
                <p>Workout Name: ${workoutName}</p>
            `;
            setsContainer.appendChild(setDiv);

            // Create a delete button for each set
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-button');
        deleteBtn.classList.add('red-button');

       
        deleteBtn.addEventListener('click', () => {
            // Prompt the user for confirmation
            const confirmDelete = confirm('Are you sure you want to delete this set?');
            if (confirmDelete) {
                // Handle set deletion here
                deleteSet(set.setID); // Call function to delete the set
            }
        });

        // Append the delete button to the setDiv
        setDiv.appendChild(deleteBtn);

        const viewInfoBtn = document.createElement('button');
        viewInfoBtn.textContent = 'View Information';
        viewInfoBtn.classList.add('view-info-button', 'blue-button');

        
        viewInfoBtn.addEventListener('click', () => {
            
            window.location.href = `setInfo.html?setID=${set.setID}`;
        });

        
        setDiv.appendChild(viewInfoBtn);
        }
    }
   
async function deleteSet(setID) {
    try {
        const response = await fetch('http://localhost:8000/' + userID + '/sets/' + setID, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error deleting set: ${response.statusText}`);
        }

        // If the deletion was successful, remove the set from the UI
        const setToDelete = document.querySelector(`[data-set-id="${setID}"]`);
        if (setToDelete) {
            setToDelete.remove();
        }
    } catch (error) {
        console.error(error);
        alert('Error deleting set. Please try again.');
    }
}


    // Fetch and render sets when the page loads
    fetchSets()
        .then(sets => {
            renderSets(sets);
        })
        .catch(error => {
            console.error(error);
        });

    createSetBtn.addEventListener('click', function() {
        window.location.href = 'setui.html'; // Replace with the actual URL to the set creation page
    });
});

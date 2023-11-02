const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      port: config.db.port
    },
  });
  
// Insert a new wellness entry
async function insertWellnessEntry(user_id, date, mood, stress, sleep, motivation, hydration, soreness) {
  try {
    await knex('wellness').insert({
      user_id,
      date,
      mood,
      stress,
      sleep,
      motivation,
      hydration,
      soreness,
    });
    console.log('Wellness entry inserted successfully.');
  } catch (error) {
    console.error('Error inserting wellness entry:', error);
  }
}

// Remove a wellness entry by ID
async function removeWellnessEntry(wellness_id) {
  try {
    await knex('wellness').where('wellness_id', wellness_id).del();
    console.log('Wellness entry removed successfully.');
  } catch (error) {
    console.error('Error removing wellness entry:', error);
  }
}

// Get a wellness entry by ID
async function getWellnessEntry(wellness_id) {
  try {
    const entry = await knex('wellness').where('wellness_id', wellness_id).first();
    return entry;
  } catch (error) {
    console.error('Error getting wellness entry:', error);
    return null;
  }
}

// Update a wellness entry by ID
async function updateWellnessEntry(wellness_id, updates) {
  try {
    await knex('wellness').where('wellness_id', wellness_id).update(updates);
    console.log('Wellness entry updated successfully.');
  } catch (error) {
    console.error('Error updating wellness entry:', error);
  }
}

// Insert a new profile entry
async function insertProfileEntry(user_id, username, created_at, height, weight, bmi, age) {
  try {
    await knex('profile').insert({
      user_id,
      username,
      created_at,
      height,
      weight,
      bmi,
      age,
    });
    console.log('Profile entry inserted successfully.');
  } catch (error) {
    console.error('Error inserting profile entry:', error);
  }
}

// Remove a profile entry by ID
async function removeProfileEntry(profile_id) {
  try {
    await knex('profile').where('profile_id', profile_id).del();
    console.log('Profile entry removed successfully.');
  } catch (error) {
    console.error('Error removing profile entry:', error);
  }
}

// Get a profile entry by ID
async function getProfileEntry(profile_id) {
  try {
    const entry = await knex('profile').where('profile_id', profile_id).first();
    return entry;
  } catch (error) {
    console.error('Error getting profile entry:', error);
    return null;
  }
}

// Update a profile entry by ID
async function updateProfileEntry(profile_id, updates) {
  try {
    await knex('profile').where('profile_id', profile_id).update(updates);
    console.log('Profile entry updated successfully.');
  } catch (error) {
    console.error('Error updating profile entry:', error);
  }
}

// Example usage
async function exampleUsage() {
  // Insert a wellness entry
  await insertWellnessEntry(1, '2023-10-31', 'better', 'mild', 'good', 'higher', 'clear', 'none');

  // Get a wellness entry
  const wellnessEntry = await getWellnessEntry(1);
  console.log('Retrieved wellness entry:', wellnessEntry);

  // Update a wellness entry
  await updateWellnessEntry(1, { mood: 'best', motivation: 'highest' });

  // Insert a profile entry
  await insertProfileEntry(1, 'JohnDoe', '2023-10-31', 180, 75, 23.4, 30);

  // Remove a profile entry
  await removeProfileEntry(1);

  // Close the database connection
  knex.destroy();
}

exampleUsage();

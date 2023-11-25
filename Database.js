const mysql = require("mysql");
const db = require("./lib/main/util/sqlconnector.js");
const genUUID = require("./lib/main/util/util.js");

const config = {
  app: {
    port: 8000,
    host: 'localhost'
  },
  db: {
    host:"mysql-b1360a5-sam2001fabian-79c2.a.aivencloud.com",
    user:"avnadmin",
    password:"AVNS_q-_1nPk2Wfg88rY72Nr",
    port:"10623",
    database:"defaultdb"
  }
};

(async () => {
  console.log('Starting the async function');
  const knex = require('knex')({
    client: 'mysql',
    connection: {
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      port: config.db.port
    },
  });
  
  // Define the table schemas
  const tables = [
    {
      name: 'defaultexercise',
      schema: (table) => {
      table.string('exercise_id').primary();
      table.string('user_id').notNullable();
      table.string('name');
      table.string('target_muscle_group');
      table.string('forces');
      table.string('rest_interval');
      table.string('progression');
      table.string('link');
      }
    },
    {
      name: 'security',
      schema: (table) => {
        table.string('username').primary();
        table.string('user_id').notNullable();
        table.string('password').notNullable();
      },
    },
    {
      name: 'wellness',
      schema: (table) => {
        table.string('wellness_id').primary();
        table.string('user_id').notNullable();
        table.date('date').notNullable();
        table.enu('mood', ['worst', 'worse', 'normal', 'better', 'best']).notNullable();
        table.enu('stress', ['extreme', 'high', 'moderate', 'mild', 'relaxed']).notNullable();
        table.enu('sleep', ['terrible', 'poor', 'fair', 'good', 'excellent']).notNullable();
        table.enu('motivation', ['lowest', 'lower', 'normal', 'higher', 'highest']).notNullable();
        table.enu('hydration', ['brown', 'orange', 'yellow', 'light', 'clear']).notNullable();
        table.enu('soreness', ['severe', 'strong', 'moderate', 'mild', 'none']).notNullable();
      },
    },
    {
      name: 'profile',
      schema: (table) => {
        table.string('profile_id').primary();
        table.integer('user_id').notNullable();
        table.string('username');
        table.timestamp('created_at');
        table.float('height').notNullable();
        table.float('weight').notNullable();
        table.float('bmi').notNullable();
        table.integer('age').notNullable();
      },
    },
    {
      name: 'workout',
      schema: (table) => {
        table.bigInteger('workoutID').primary();
        table.string('name', 255);
        table.bigInteger('userID').notNullable();
        table.enu('difficulty', ['easy', 'medium', 'hard', 'near_maximum', 'limit', 'failure']);
        table.time('timeStart');
        table.time('timeEnd');
        table.date('date');
        table.enu('status', ['IN_PROGRESS', 'COMPLETED', 'STARTED']);
      }, 
    },
    {
      name: 'exercise',
      schema: (table) => {
        table.bigInteger('exerciseID').primary();
        table.bigInteger('userID').notNullable();
        table.string('name');
        table.enu('target_muscle_group', [
          'abdominals',
          'biceps',
          'calves',
          'chest',
          'forearm',
          'glutes',
          'grip',
          'hamstrings',
          'hips',
          'lats',
          'lower_back',
          'middle_back',
          'neck',
          'quadriceps',
          'shoulders',
          'triceps'
        ]);
        table.enu('forces', ['push', 'pull']);
        table.time('rest_interval');
        table.enu('rest_interval_metric', ['stength', 'hypertrophy','endurance','power', 'rehabilitation']);
        table.enu('progression', ['weight', 'reps', 'time', 'distance']);
        table.string('link');
      }, 
    },
    {
      name: 'sets',
      schema: (table) => {
        table.bigInteger('setID').primary();
        table.string('exerciseID', 255).notNullable();
        table.bigInteger('userID').notNullable();
        table.string('workoutID').notNullable();
        table.date('Date').notNullable();
        table.integer('num_of_times');
        table.integer('weight');
        table.enu('weight_metric', ['lbs', 'kg', 'ton', 'tonne']);
        table.integer('distance');
        table.enu('distance_metric', ['feet', 'yards', 'miles', 'meters', 'kilometers']);
        table.time('rep_time');
        table.time('rest_period');
        table.enu('difficulty', ['easy', 'medium', 'hard', 'near_maximum', 'limit', 'failure']);
        table.time('time_start');
        table.time('time_end');
      },   
    },
    {
      name: 'users',
      schema: (table) => {
        table.string('username').primary();
        table.string('password').notNullable();
        table.bigInteger('userID').notNullable();
      },
    },
  ];

  // Function to create tables
  async function createTables() {
    for (const { name, schema } of tables) {
      // Comment out the creation code
      try {
      await knex.schema.createTable(name, schema);
      } catch (error){
        console.log(error);
      }

      // Uncomment this line to delete the table before creating it
     //await knex.schema.dropTableIfExists(defaultexercise);

      console.log(`Table ${name} created.`);
    }
  }

  // Function to delete tables (if needed)
  async function deleteTables() {
    for (const { name } of tables) {
      await knex.schema.dropTableIfExists(name);
      console.log(`Table ${name} deleted.`);
    }
  }

  async function addDefaultExercises() {
    try {
      const userID = "0000000000000000000000"; // Replace with your actual userID if necessary
  
      // Array of default exercises to be inserted
      const defaultExercises = [
        { name: 'Push-up', target_muscle_group: 'chest', forces: 'push', rest_interval: '1', progression: 'reps', link: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
        { name: 'Sit-up', target_muscle_group: 'abdominals', forces: 'push', rest_interval: '1', progression: 'reps', link: 'https://www.youtube.com/watch?v=1fbU_MkV7NE' },
        { name: 'Plank', target_muscle_group: 'abdominals', forces: 'push', rest_interval: '1', progression: 'reps', link: 'https://www.youtube.com/watch?v=yeKv5oX_6GY' },
        { name: 'Squats', target_muscle_group: 'glutes', forces: 'push', rest_interval: '1', progression: 'reps', link: 'https://www.youtube.com/watch?v=IB_icWRzi4E' },
      ];
  
      // Insert default exercises into the database
      for (const exercise of defaultExercises) {
        const exerciseID = knex.raw("REPLACE(UUID(),'-','')"); // Generating UUID for each exercise
        await knex('defaultexercise').insert({
          exercise_id: exerciseID,
          user_id: userID,
          name: exercise.name,
          target_muscle_group: exercise.target_muscle_group,
          forces: exercise.forces,
          rest_interval: exercise.rest_interval,
          progression: exercise.progression,
          link: exercise.link
        });
      }
  
      console.log('Default exercises added successfully.');
    } catch (error) {
      console.error('Error adding default exercises:', error);
    }
  }
    

  // Function to generate database documentation
  function generateDocumentation() {
    const documentation = tables.map(({ name, schema }) => {
      const tableSchema = knex.schema.createTable(name, schema).toString();
      return `**Table: ${name}**\n\n${tableSchema}`;
    }).join('\n\n');

    console.log(documentation);
  }

  try {
    // Create tables
    await createTables();
    await addDefaultExercises();
    // Delete tables (if needed)
    //await deleteTables('users');

    // Generate database documentation
    generateDocumentation();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the database connection
    knex.destroy();
  }

  console.log('Exiting the async function');
})();

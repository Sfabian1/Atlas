const mysql = require("mysql");
const db = require("./lib/main/util/sqlconnector.js");
const genUUID = require("./lib/main/util/util.js");

const config = {
  app: {
    port: 8000,
    host: 'localhost'
  },
  db: {
    host: "mysql-757580f-scarletmail-41ca.a.aivencloud.com", // Replace with your remote database host
    user: "avnadmin", // Replace with your database username
    password: "AVNS_WoKhjweGPR4478K1pNo", // Replace with your database password
    database: "defaultdb", // Replace with your database name
    port: "19157" // Replace with your database port
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
      table.string('force', ['push', 'pull']);
      table.string('rest_interval');
      table.string('progression', ['weight', 'reps', 'time', 'distance']);
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
        table.string('user_id').notNullable();
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
        table.string('workout_id', 255).primary();
        table.string('name', 255);
        table.integer('user_id');
        table.string('difficulty', 255);
        table.string('timeStart', 255);
        table.string('timeEnd', 255);
        table.string('date', 255);
        table.string('status', 255);
      }, 
    },
    {
      name: 'exercise',
      schema: (table) => {
        table.string('exercise_id').primary();
        table.string('user_id').notNullable();
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
        table.enu('force', ['push', 'pull']);
        table.time('rest_interval');
        table.enu('progression', ['weight', 'reps', 'time', 'distance']);
        table.string('link');
      },
    },
    {
      name: 'sets',
      schema: (table) => {
        table.string('setID').primary();
        table.string('exerciseID').notNullable();
        table.string('userID').notNullable();
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
    }
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
     //await knex.schema.dropTableIfExists(name);

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
        var userID = "0000000000000000000000";
        const connectionDB = await db.connection;
    
        const ExerciseD = genUUID.generateShortUUID();
        var query = "INSERT INTO defaultexercise VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await connectionDB.query(query,[ExerciseD, userID, 'Push-up', 'chest', 'push', '1', 'reps', 'https://www.youtube.com/watch?v=IODxDxX7oi4']);
    
        const ExerciseA = genUUID.generateShortUUID();
        var query = "INSERT INTO defaultexercise VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await connectionDB.query(query,[ExerciseA, userID, 'Sit-up', 'abdominals', 'push', '1', 'reps', 'https://www.youtube.com/watch?v=1fbU_MkV7NE']);
    
        const ExerciseB = genUUID.generateShortUUID();
        var query = "INSERT INTO defaultexercise VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await connectionDB.query(query,[ExerciseB, userID, 'Plank', 'abdominals', 'push', '1', 'reps', 'https://www.youtube.com/watch?v=yeKv5oX_6GY']);
    
        const ExerciseC = genUUID.generateShortUUID();
        var query = "INSERT INTO defaultexercise VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await connectionDB.query(query, [ExerciseC, userID, 'Squats', 'glutes', 'push', '1', 'reps', 'https://www.youtube.com/watch?v=IB_icWRzi4E']);
      } catch (error) {
        console.error(error);
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
    //await deleteTables();

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
const config = {
  app: {
      port: 8000,
      host: 'localhost'
  },
  db: {
      host: "mysql-3d532cd0-testvapp.a.aivencloud.com", // Replace with your remote database host
      user: "avnadmin", // Replace with your database username
      password: "AVNS_rpXTNpZ2xrc8dNe-ih6", // Replace with your database password
      database: "defaultdb", // Replace with your database name
      port: "20550" // Replace with your database port
  }
}

(async () => {
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

// Define the table schemas
const tables = [
  {
    name: 'security',
    schema: (table) => {
      table.string('username').primary();
      table.integer('user_id').notNullable();
      table.string('password').notNullable();
    },
  },
  {
      name: 'wellness',
      schema: (table) => {
        table.increments('wellness_id').primary();
        table.integer('user_id').notNullable();
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
        table.increments('profile_id').primary();
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
        table.increments('workout_id').primary();
        table.string('name');
        table.integer('user_id').notNullable();
        table.enu('difficulty', ['easy', 'medium', 'hard', 'near_maximum', 'limit', 'failure']);
        table.time('timeStart').notNullable();
        table.time('timeEnd').notNullable();
        table.date('date').notNullable();
        table.enu('status', ['IN_PROGRESS', 'COMPLETED', 'STARTED']);
      },
    },
    
    {
      name: 'exercise',
      schema: (table) => {
        table.increments('exercise_id').primary();
        table.integer('user_id').notNullable();
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
    }
    

      {
      name: 'set',
      schema: (table) => {
        table.increments('set_id').primary();
        table.integer('exercise_id').notNullable();
        table.integer('user_id').notNullable();
        table.integer('workout_id').notNullable();
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
    await knex.schema.createTable(name, schema);
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

  // Delete tables (if needed)
  // await deleteTables();

  // Generate database documentation
  generateDocumentation();
} catch (error) {
  console.error("Error:", error);
} finally {
  // Close the database connection
  knex.destroy();
}
})();



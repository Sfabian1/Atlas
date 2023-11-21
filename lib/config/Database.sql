-- Active: 1699546319520@@127.0.0.1@11121
CREATE TABLE `security` (
  `username` varchar(255) PRIMARY KEY,
  `user_id` integer NOT NULL,
  `password` varchar(255) NOT NULL
);

CREATE TABLE `wellness` (
  `wellness_id` integer PRIMARY KEY,
  `user_id` integer NOT NULL,
  `date` DATE NOT NULL,
  `mood` ENUM ('worst', 'worse', 'normal', 'better', 'best') NOT NULL,
  `stress` ENUM ('extreme', 'high', 'moderate', 'mild', 'relaxed') NOT NULL,
  `sleep` ENUM ('terrible', 'poor', 'fair', 'good', 'excellent') NOT NULL,
  `motivation` ENUM ('lowest', 'lower', 'normal', 'higher', 'highest') NOT NULL,
  `hydration` ENUM ('brown', 'orange', 'yellow', 'light', 'clear') NOT NULL,
  `soreness` ENUM ('severe', 'strong', 'moderate', 'mild', 'none') NOT NULL
);

CREATE TABLE `profile` (
  `profile_id` VARCHAR(255) PRIMARY KEY,
  `user_id` integer NOT NULL,
  `username` varchar(255),
  `created_at` timestamp,
  `height` FLOAT NOT NULL,
  `weight` FLOAT NOT NULL,
  `bmi` FLOAT NOT NULL,
  `age` INT NOT NULL
);

CREATE TABLE `workout` (
  `workout_id` integer PRIMARY KEY,
  `name` varchar(255),
  `user_id` integer NOT NULL,
  `difficulty` ENUM ('easy', 'medium', 'hard', 'near_maximum', 'limit', 'failure'),
  `timeStart` time NOT NULL,
  `timeEnd` time NOT NULL,
  `date` date NOT NULL,
  `status` ENUM ('IN_PROGRESS', 'COMPLETED', 'STARTED')
);

CREATE TABLE `exercise` (
  `exercise_id` integer PRIMARY KEY,
  `user_id` integer NOT NULL,
  `name` varchar(255),
  `target_muscle_group` ENUM ('abdominals', 'biceps', 'calves', 'chest', 'forearm', 'glutes', 'grip', 'hamstrings', 'hips', 'lats', 'lower_back', 'middle_back', 'neck', 'quadriceps', 'shoulders', 'traps', 'triceps'),
  `force` ENUM ('push', 'pull'),
  `rest_interval` time,
  `progression` ENUM ('weight', 'reps', 'time', 'distance'),
  `link` varchar(255)
);

CREATE TABLE `set` (
  `set_id` integer PRIMARY KEY,
  `exercise_id` integer NOT NULL,
  `user_id` integer NOT NULL,
  `workout_id` integer NOT NULL,
  `Date` DATE NOT NULL,
  `num_of_times` integer,
  `weight` integer,
  `weight_metric` ENUM ('lbs', 'kg', 'ton', 'tonne'),
  `distance` integer,
  `distance_metric` ENUM ('feet', 'yards', 'miles', 'meters', 'kilometers'),
  `rep_time` time,
  `rest_period` time,
  `difficulty` ENUM ('easy', 'medium', 'hard', 'near_maximum', 'limit', 'failure'),
  `time_start` time,
  `time_end` time
);

ALTER TABLE `wellness` ADD FOREIGN KEY (`user_id`) REFERENCES `profile` (`user_id`);
ALTER TABLE `security` ADD FOREIGN KEY (`user_id`) REFERENCES `profile` (`user_id`);
ALTER TABLE `set` ADD FOREIGN KEY (`exercise_id`) REFERENCES `exercise` (`exercise_id`);
ALTER TABLE `workout` ADD FOREIGN KEY (`user_id`) REFERENCES `profile` (`user_id`);
ALTER TABLE `exercise` ADD FOREIGN KEY (`user_id`) REFERENCES `profile` (`user_id`);
ALTER TABLE `set` ADD FOREIGN KEY (`user_id`) REFERENCES `profile` (`user_id`);
ALTER TABLE `set` ADD FOREIGN KEY (`workout_id`) REFERENCES `workout` (`workout_id`);

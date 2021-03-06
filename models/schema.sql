CREATE TABLE users
(
  email VARCHAR(255) UNIQUE NOT NULL,
  firstname VARCHAR(25) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  id VARCHAR(255) UNIQUE PRIMARY KEY,
  lastname VARCHAR(25) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_on TIMESTAMP NOT NULL
);

CREATE TABLE goals
(
  id VARCHAR(255) UNIQUE PRIMARY KEY,
  body VARCHAR NOT NULL,
  user_id VARCHAR(255) REFERENCES users(id) NOT NULL,
  is_achieved BOOLEAN NOT NULL DEFAULT FALSE,
  created_on TIMESTAMP NOT NULL
);

CREATE TABLE todos
(
  id VARCHAR(255) UNIQUE PRIMARY KEY,
  body VARCHAR NOT NULL,
  goal_id VARCHAR(255) REFERENCES goals(id) NOT NULL,
  is_done BOOLEAN NOT NULL DEFAULT FALSE,
  created_on TIMESTAMP NOT NULL
);

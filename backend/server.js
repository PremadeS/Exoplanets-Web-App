const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host : '127.0.0.1',
  user : 'username',
  password : 'password',
  database : 'exoplanetsDB'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// For planets..
app.get('/planets', (req, res) => {
  const query = 'SELECT * FROM planets';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({error : err.message});
    }
    // console.log("rows", results);
    res.json(results);
  });
});

// For users..

app.post('/users', (req, res) => {
  const {username, password} = req.body;

  console.log(username, "    ", password);

  if (!username || !password) {
    return res.status(400).json({error : "Empty username or password"});
  }

  const query = 'SELECT * FROM users WHERE username = ? AND password_hash = ?';
  const hash = crypto.createHash('sha256').update(password).digest('hex');

  connection.query(query, [ username, hash ], (err, results) => {
    if (err) {
      return res.status(500).json({error : err.message});
    }

    if (results.length > 0) {
      const userId = results[0].user_id;

      const query2 = `SELECT in_game_level, in_game_experience, spaceship_level 
                      FROM user_game_data WHERE user_id = ?`;

      connection.query(query2, [ userId ], (err, gameData) => {
        if (err) {
          return res.status(500).json({error : err.message});
        }

        if (gameData.length > 0) {
          res.json({
            success : true,
            in_game_level : gameData[0].in_game_level,
            in_game_experience : gameData[0].in_game_experience,
            spaceship_level : gameData[0].spaceship_level
          });
        } else {
          res.json({success : false, error : "No game data found"});
        }
      });
    } else {
      res.json({success : false});
    }
  });
});

// For admin sign in
app.post('/admin', (req, res) => {
  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(500).json({error : "empty username or password"});
  }

  const query = 'SELECT * FROM users WHERE username = ? AND password_hash = ? AND role = \'admin\'';
  const hash = crypto.createHash('sha256').update(password).digest('hex');

  connection.query(query, [ username, hash ], (err, results) => {
    console.log(results);

    if (err) {
      return res.status(500).json({error : err.message});
    }
    if (results.length > 0) {
      res.json({success : true});
    } else {
      res.json({success : false});
    }
  });
});

// adding new planet..
app.post('/api/planets', (req, res) => {
  const {name, mass, discoveryYear, type, distanceFromEarth, radius, imageUrl} = req.body;

  if (!name || !mass || !discoveryYear || !type || !distanceFromEarth || !radius || !imageUrl) {
    return res.status(400).json({message : 'All fields are required.'});
  }

  const query = `
    INSERT INTO planets (name, mass, discovery_year, type, distance_from_earth, radius, imageUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
      query, [ name, mass, discoveryYear, type, distanceFromEarth, radius, imageUrl ],
      (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).json({message : 'Failed to add planet to database.'});
        }
        res.status(201).json({message : 'Planet added successfully!', planetId : result.insertId});
      });
});

// running queries..
app.post("/api/query", (req, res) => {
  const {query} = req.body;

  if (!query) {
    return res.status(400).json({error : "Query cannot be empty."});
  }

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({error : error.message});
    }

    res.json(results);
  });
});

// sign up..
app.post('/signup', (req, res) => {
  const {username, password, email} = req.body;

  if (!username || !password) {
    return res.status(400).json({error : "Empty username or password"});
  }

  const checkUserExists = (callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [ username ], (err, results) => {
      if (err)
        return callback(err);
      if (results.length > 0) {
        return callback(new Error("Username already exists"));
      }
      callback(null);
    });
  };

  const createUser = (callback) => {
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    const query = `INSERT INTO users (username, password_hash, email, role)
                   VALUES (?, ?, ?, 'user')`;
    connection.query(query, [ username, hash, email ], (err, results) => {
      if (err)
        return callback(err);
      callback(null, results.insertId);
    });
  };

  const createGameData = (userId, callback) => {
    const query = `INSERT INTO user_game_data (user_id, in_game_level, in_game_experience, spaceship_level)
                   VALUES (?, 1, 0, 1)`;
    connection.query(query, [ userId ], (err) => {
      if (err)
        return callback(err);
      callback(null);
    });
  };

  connection.beginTransaction((err) => {
    if (err)
      return res.status(500).json({error : err.message});

    checkUserExists((err) => {
      if (err) {
        return connection.rollback(() => {
          res.status(err.message === "Username already exists" ? 400 : 500).json({success : false, error : err.message});
        });
      }

      createUser((err, userId) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({error : err.message});
          });
        }

        createGameData(userId, (err) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({error : err.message});
            });
          }

          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({error : err.message});
              });
            }

            res.status(200).json({success : true});
          });
        });
      });
    });
  });
});

app.post('/upgrade', (req, res) => {
  const username = req.body.username;

  const findUserQuery = `
    SELECT user_id
    FROM users
    WHERE username = ?`;

  connection.query(findUserQuery, [ username ], (err, results) => {
    if (err) {
      return res.status(500).json({error : 'Database error during user lookup', details : err});
    }

    if (results.length === 0) {
      return res.status(404).json({error : 'User not found'});
    }

    const user_id = results[0].user_id;

    const query = `
      SELECT in_game_experience, spaceship_level 
      FROM user_game_data 
      WHERE user_id = ?`;

    connection.query(query, [ user_id ], (err, results) => {
      if (err) {
        return res.status(500).json({error : 'Database error during game data lookup', details : err});
      }

      if (results.length === 0) {
        return res.status(404).json({error : 'User game data not found'});
      }

      const userGameData = results[0];

      if (userGameData.in_game_experience < 5) {
        return res.status(400).json({error : 'Not enough in-game experience to upgrade'});
      }

      const upgradeQuery = `
        UPDATE user_game_data
        SET spaceship_level = spaceship_level + 1,
            in_game_experience = in_game_experience - 5
        WHERE user_id = ?`;

      connection.query(upgradeQuery, [ user_id ], (err, updateResult) => {
        if (err) {
          return res.status(500).json({error : 'Failed to update game data', details : err});
        }

        res.json({
          success : true,
          newSpaceshipLevel : userGameData.spaceship_level + 1,
          newExp : userGameData.in_game_experience
        });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
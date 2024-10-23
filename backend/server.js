const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

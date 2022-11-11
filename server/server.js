const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "tododb",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Register User
app.post("/register", async (request, response) => {
  const { name, password, email } = request.body;
  const hashedPassword = await bcrypt.hash(request.body.password, 10);

  const createUserQuery = `
      INSERT INTO 
        users (name, password, email)
      VALUES 
        ( 
          '${name}',
          '${hashedPassword}',
          '${email}'
        )`;
  db.query(createUserQuery, (err, res) => {
    if (err) throw err;
    response.send(res);
  });
});

//Login

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  console.log(request.body.username);
  db.query(
    `SELECT * FROM users WHERE name = ${username}`,
    [username],
    (err, result) => {
      if (err) {
        response.send({ err: err });
      }
      response.send(result);
      console.log(result);
    }
  );
});

app.listen(3005, () => {
  console.log("My Sql Database is running.....3005");
});

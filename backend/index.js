const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const port = 3333;
const cors = require("cors");
const bodyParser = require("body-parser");
const { connect, sql } = require("./db.js");

saltRounds = 10;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24 * 1000,
    },
  })
);

connect()
  .then((connection) => {
    console.log("Connected to the database.");
  })
  .catch((error) => {
    console.log("Database connection failed!");
    console.log(error);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const pool = await sql.connect();
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM users WHERE email = @email");

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      bcrypt.compare(password, user.password, (error, response) => {
        if (response) {
          req.session.user = user;
          res.send(user);
        } else {
          res.send({ message: "Wrong username/password combination" });
        }
      });
    } else {
      res.send({ message: "User doesn't exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: "An error occurred during login" });
  }
});

app.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const hash = await bcrypt.hash(password, saltRounds);

    const pool = await sql.connect();
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, hash)
      .query("INSERT INTO users (email, password) VALUES (@email, @password)");

    res.json("User has been created successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while creating the user.");
  }
});

//Minutes of Meeting Logic

//Fetch all Meeting
app.get("/minofmeet", async (req, res) => {
  try {
    const pool = await sql.connect();

    const query = "SELECT * FROM minofmeet";

    const result = await pool.request().query(query);

    return res.json(result.recordset);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching data." });
  }
});

//Fetch Meeting by ID
app.get("/minofmeet/:id", async (req, res) => {
  const minOfMeetId = req.params.id;

  try {
    const pool = await sql.connect();

    const query = "SELECT * FROM minofmeet WHERE id = @minOfMeetId";

    const result = await pool
      .request()
      .input("minOfMeetId", sql.Int, minOfMeetId)
      .query(query);

    return res.json(result.recordset);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching data." });
  }
});

//Add Meeting
app.post("/minofmeet", async (req, res) => {
  const {
    title,
    venue,
    date,
    startTime,
    endTime,
    duration,
    attendees,
    chairedBy,
    presents,
    absents,
    highlights,
  } = req.body;

  const query = `
    INSERT INTO minofmeet (
      title, venue, date, startTime, endTime, duration, attendees,
      chairedBy, presents, absents, highlights
    ) VALUES (
      @title, @venue, @date, @startTime, @endTime, @duration, @attendees,
      @chairedBy, @presents, @absents, @highlights
    )
  `;

  try {
    const pool = await sql.connect();
    await pool
      .request()
      .input("title", sql.VarChar, title)
      .input("venue", sql.VarChar, venue)
      .input("date", sql.VarChar, date)
      .input("startTime", sql.VarChar, startTime)
      .input("endTime", sql.VarChar, endTime)
      .input("duration", sql.VarChar, duration)
      .input("attendees", sql.NVarChar, JSON.stringify(attendees))
      .input("chairedBy", sql.VarChar, chairedBy)
      .input("presents", sql.NVarChar, JSON.stringify(presents))
      .input("absents", sql.NVarChar, JSON.stringify(absents))
      .input("highlights", sql.NVarChar, JSON.stringify(highlights))
      .query(query);

    res.json("Meeting has been created successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Update Meeting
app.put("/minofmeet/:id", async (req, res) => {
  const minOfMeetId = req.params.id;

  const query = `
    UPDATE minofmeet
    SET
      title = @title,
      venue = @venue,
      date = @date,
      startTime = @startTime,
      endTime = @endTime,
      duration = @duration,
      attendees = @attendees,
      chairedBy = @chairedBy,
      presents = @presents,
      absents = @absents,
      highlights = @highlights
    WHERE id = @id
  `;

  try {
    const pool = await sql.connect();

    await pool
      .request()
      .input("title", sql.VarChar, req.body.title)
      .input("venue", sql.VarChar, req.body.venue)
      .input("date", sql.VarChar, req.body.date)
      .input("startTime", sql.VarChar, req.body.startTime)
      .input("endTime", sql.VarChar, req.body.endTime)
      .input("duration", sql.VarChar, req.body.duration)
      .input("attendees", sql.NVarChar, JSON.stringify(req.body.attendees))
      .input("chairedBy", sql.VarChar, req.body.chairedBy)
      .input("presents", sql.NVarChar, JSON.stringify(req.body.presents))
      .input("absents", sql.NVarChar, JSON.stringify(req.body.absents))
      .input("highlights", sql.NVarChar, JSON.stringify(req.body.highlights))
      .input("id", sql.Int, minOfMeetId)
      .query(query);

    res.json("Meeting has been updated successfully");
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the meeting." });
  }
});

//Delete Meeting
app.delete("/minofmeet/:id", async (req, res) => {
  const minOfMeetId = req.params.id;

  const query = "DELETE FROM minofmeet WHERE id = @id";

  try {
    const pool = await sql.connect();

    await pool.request().input("id", sql.Int, minOfMeetId).query(query);

    console.log("Meeting has been deleted successfully");
    res.json("Meeting has been deleted successfully");
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the meeting." });
  }
});

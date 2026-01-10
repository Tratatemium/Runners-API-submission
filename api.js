const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const { getRunsCollection } = require("./database.js");

const PORT = process.env.PORT;

const serverTimeStart = Date.now();

app.get("/", (req, res) => {
  res.sendStatus(501);
});

app.get("/runtime", (req, res) => {
  const serverTimeCurrent = (Date.now() - serverTimeStart) / 1000;
  const serverTimeCurrentRounded = Math.round(serverTimeCurrent * 10) / 10;
  res.send(`Server is running for ${serverTimeCurrentRounded} s.`);
});

// app.get();

/* ================================================================================================= */
/*  LISTEN                                                                                           */
/* ================================================================================================= */

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

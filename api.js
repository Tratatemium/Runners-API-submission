/* ================================================================================================= */
/*  IMPORTS                                                                                          */
/* ================================================================================================= */

const express = require("express");
const app = express();

const dotenv = require("dotenv");
if (!process.env.PORT) {
    dotenv.config();
}

const { getRunsCollection, getRunByID } = require("./database.js");

/* ================================================================================================= */
/*  VARIABLES                                                                                        */
/* ================================================================================================= */

const PORT = process.env.PORT || 3000;

const serverTimeStart = Date.now();

/* ================================================================================================= */
/*  REQUESTS                                                                                         */
/* ================================================================================================= */

app.get("/", (req, res) => {
  res.send("Hi there! This is a runners app server.");
});

app.get("/server-runtime", (req, res) => {
  const serverTimeCurrent = (Date.now() - serverTimeStart) / 1000;
  const serverTimeCurrentRounded = Math.round(serverTimeCurrent * 10) / 10;
  res.send(`Server is running for ${serverTimeCurrentRounded} s.`);
});

app.get("/run/:id", async (req, res) => {
  const data = await getRunByID(req.params.id);
  if (data) {
    res.send(data);
  } else {
    res.status(404).send(`No run with ID ${req.params.id} found!`);
  }
});

/* ================================================================================================= */
/*  LISTEN                                                                                           */
/* ================================================================================================= */

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

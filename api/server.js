/* ================================================================================================= */
/*  IMPORTS                                                                                          */
/* ================================================================================================= */

const express = require("express");
const app = express();
app.use(express.json());

const dotenv = require("dotenv");
if (!process.env.PORT) {
    dotenv.config();
}

const { getRunByID, addNewRun } = require("../database.js");

/* ================================================================================================= */
/*  VARIABLES                                                                                        */
/* ================================================================================================= */

const PORT = process.env.PORT || 3000;

const serverTimeStart = Date.now();

/* ================================================================================================= */
/*  HELPER FUNCTIONS                                                                                 */
/* ================================================================================================= */

const isUUID = (str) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

const isCorrectISODate = (str) => {
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

  if (!isoRegex.test(str)) return false;

  const date = new Date(str);
  return !isNaN(date.getTime());
};

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
    res.status(404)
        .send(`error: No run with ID ${req.params.id} found!`);
  }
});

/* ================================================================================================= */
/*  PUT NEW RUN                                                                                      */
/* ================================================================================================= */

const validateRunFields = ({ userId, startTime, durationSec, distanceMeters }) => {

  if (!userId || !startTime || durationSec == null || distanceMeters == null) {
    const err = new Error("Must contain all data: userId, startTime, durationSec, distanceMeters.");
    err.status = 400;
    throw err;
  }

  if (!isUUID(userId)) {
    const err = new Error("userId must be a valid UUID.");
    err.status = 400;
    throw err;
  }

  if (!isCorrectISODate(startTime)) {
    const err = new Error("startTime must be a valid date in the ISO 8601 format.");
    err.status = 400;
    throw err;
  }

  const durationNormalized = Number(durationSec);
  const distanceNormalized = Number(distanceMeters);

  if (isNaN(durationNormalized) || durationNormalized <= 0) {
    const err = new Error("durationSec must be a positive number.");
    err.status = 400;
    throw err;
  }

  if (isNaN(distanceNormalized) || distanceNormalized <= 0) {
    const err = new Error("distanceMeters must be a positive number.");
    err.status = 400;
    throw err;
  }

  return {
    userId,
    startTime,
    durationSec: durationNormalized,
    distanceMeters: distanceNormalized
  };
};

const parseAndValidateRun = (req) => {
  if (!req.is("json")) {
    const err = new Error("Content-Type must be application/json.");
    err.status = 415;
    throw err;
  }
  const { userId, startTime, durationSec, distanceMeters } = req.body;
  const newRun = validateRunFields({ userId, startTime, durationSec, distanceMeters });
  return newRun;
};


app.post("/new-run", async (req, res) => {
  try {
    const newRun = parseAndValidateRun(req);
    const newRunID = await addNewRun(newRun);
    res.status(201)
      .send(`New run ID: ${newRunID}`);

  } catch (err) {
    if (!err.status || err.status >= 500) {
      console.error("Server error in /runs:", err);
    }
    res.status(err.status || 500)
      .send(err.message);
  }
});

/* ================================================================================================= */
/*  MIDDLEWARE                                                                                       */
/* ================================================================================================= */

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res
      .status(400)
      .send("error: Invalid JSON");
  }
  
  return next(err);
});

/* ================================================================================================= */
/*  LISTEN                                                                                           */
/* ================================================================================================= */

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

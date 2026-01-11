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

const { getRunByID, addNewRun } = require("./database.js");

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

app.put("/new-run", async (req, res) => {
  try {
    if (!req.is("application/json")) {
      return res
        .status(415)
        .send("error: Content-Type must be application/json");
    }

    const { userId, startTime, durationSec, distanceMeters } = req.body;

    if (!userId || !startTime || durationSec == null || distanceMeters == null) {
      return res
        .status(400)
        .send(
          "error: Must contain all data: userId, startTime, durationSec, distanceMeters."
        );
    }

    if (!isUUID(userId)) {
      return res
        .status(400)
        .send("error: userId must be a valid UUID.");
    }

    if (!isCorrectISODate(startTime)) {
      return res
        .status(400)
        .send("error: startTime must be a valid date in the ISO 8601 format.");
    }

    if (isNaN(durationSec) || durationSec <= 0) {
      return res
        .status(400)
        .send("error: durationSec must be a positive number.");
    }

    if (isNaN(distanceMeters) || distanceMeters <= 0) {
      return res
        .status(400)
        .send("error: distanceMeters must be a positive number.");
    }

    durationSec = Number(durationSec);
    distanceMeters = Number(distanceMeters);

    const newRun = {
      userId,
      startTime,
      durationSec,
      distanceMeters,
    };
    const newRunID = await addNewRun(newRun);
    if (!newRunID) {
      return res
        .status(500)
        .send("error: Failed to save new run. Try again later.");
    }

    res.status(201)
      .send(`New run ID: ${newRunID}`);

  } catch (err) {
    console.error("Unexpected error in /new-run:", err);
    return res.sendStatus(500);
  }
});


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

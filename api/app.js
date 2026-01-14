/* ================================================================================================= */
/*  IMPORTS                                                                                          */
/* ================================================================================================= */

const express = require("express");
const app = express();

/* ================================================================================================= */
/*  SERVER VARIABLES                                                                                 */
/* ================================================================================================= */

const serverTimeStart = Date.now();

/* ================================================================================================= */
/*  ROUTE IMPORTS                                                                                    */
/* ================================================================================================= */

const runsGetRoutes = require("./routes/runs.get.routes.js");
const runsPostRoutes = require("./routes/runs.post.routes.js");

/* ================================================================================================= */
/*  MIDDLEWARE                                                                                       */
/* ================================================================================================= */

app.use(express.json());

/* ================================================================================================= */
/*  ROUTES                                                                                           */
/* ================================================================================================= */

// Health check routes
app.get("/", (req, res) => {
  res.send("Hi there! This is a runners app server.");
});

app.get("/server-runtime", (req, res) => {
  const serverTimeCurrent = (Date.now() - serverTimeStart) / 1000;
  const serverTimeCurrentRounded = Math.round(serverTimeCurrent * 10) / 10;
  res.send(`Server is running for ${serverTimeCurrentRounded} s.`);
});

// Runs routes
app.use("/runs", runsGetRoutes);
app.use("/runs", runsPostRoutes);

/* ================================================================================================= */
/*  ERROR HANDLING MIDDLEWARE                                                                        */
/* ================================================================================================= */

// JSON syntax error filter
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).send("error: Invalid JSON");
  }

  return next(err);
});

// FINAL error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500)
    .send(err.message || "Internal Server Error.");
});

/* ================================================================================================= */
/*  EXPORTS                                                                                          */
/* ================================================================================================= */

module.exports = app;

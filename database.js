/* ================================================================================================= */
/*  IMPORTS                                                                                          */
/* ================================================================================================= */

const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");

/* ================================================================================================= */
/*  CONFIGURATION                                                                                    */
/* ================================================================================================= */

if (!process.env.MONGO_URI) {
  dotenv.config();
}

/* ================================================================================================= */
/*  DATABASE CONNECTION                                                                              */
/* ================================================================================================= */

const client = new MongoClient(process.env.MONGO_URI);
let runs;

/* ================================================================================================= */
/*  COLLECTION INITIALIZATION                                                                        */
/* ================================================================================================= */

const getRunsCollection = async () => {
  if (!runs) {
    await client.connect();
    console.log("Connected to database.");
    const db = client.db("runners-app");
    runs = db.collection("runs");
  }
  return runs;
};

/* ================================================================================================= */
/*  DATABASE OPERATIONS                                                                              */
/* ================================================================================================= */

const getRunByID = async (runID) => {
  if (!ObjectId.isValid(runID)) {
    const err = new Error(
      "Invalid run ID format provided. It must be ObjectID."
    );
    err.status = 400;
    throw err;
  }

  const runs = await getRunsCollection();

  const selectedRun = await runs.findOne({
    _id: new ObjectId(runID),
  });
  if (!selectedRun) {
    const err = new Error(`No run with ID ${runID} found!`);
    err.status = 404;
    throw err;
  }
  return selectedRun;
};

const addNewRun = async (runJSON) => {
  const runs = await getRunsCollection();

  const result = await runs.insertOne(runJSON);
  if (!result.acknowledged) {
    const err = new Error("Failed to save new run.");
    err.status = 500;
    throw err;
  }
  console.log("New run added to the database. ID:", result.insertedId);
  return result.insertedId;
};

/* ================================================================================================= */
/*  EXPORTS                                                                                          */
/* ================================================================================================= */

module.exports = {
  client,
  getRunsCollection,
  getRunByID,
  addNewRun,
};

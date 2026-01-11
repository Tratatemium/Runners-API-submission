const { MongoClient, ObjectId } = require("mongodb");

const dotenv = require("dotenv");
if (!process.env.MONGO_URI) {
    dotenv.config();
}

const client = new MongoClient(process.env.MONGO_URI);

let runs;

const getRunsCollection = async () => {
  try {
    if (!runs) {
      await client.connect();
      console.log("Connected to database.");
      const db = client.db("runners-app");
      runs = db.collection("runs");
    }
    return runs;
  } catch (error) {
    console.error("Failed to connect to the database.", error);
  }
};

const getRunByID = async (runID) => {
  try {

    if (!ObjectId.isValid(runID)) {
      console.error("Invalid run ID format provided.");
      return null;
    }

    const runs = await getRunsCollection();
    if (!runs) {
      console.error("Runs collection is not initialized.");
      return null;
    }

    const selectedRun = await runs.find({
      _id: new ObjectId(runID),
    });
    const result = await selectedRun.toArray();
    return result[0] || null;

  } catch (error) {
    console.error("Failed to find run by ID.", error);
    return null;
  }
};

const addNewRun = async (runJSON) => {
  try {
    const runs = await getRunsCollection();
    if (!runs) {
      console.error("Runs collection is not initialized.");
      return null;
    }
    const result = await runs.insertOne(runJSON);
    if (result.acknowledged) {
      console.log("New run added to the database. ID:", result.insertedId);
      return result.insertedId;
    } else {
      console.error("Run insertion failed.");
      return null;
    }
  } catch (error) {
    console.error("Failed to add new run to the database.", error);
    return null;
  }
};

module.exports = { client, getRunsCollection, getRunByID, addNewRun };

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
    const selectedRun = await runs.find({
      _id: new ObjectId(runID),
    });
    const result = await selectedRun.toArray();
    return result[0];
  } catch (error) {
    console.error("Failed to find run by ID.", error);
  }
};

module.exports = { client, getRunsCollection, getRunByID };

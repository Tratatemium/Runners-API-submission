const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");

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
    result = await selectedRun.toArray();
    return result[0];
  } catch (error) {
    console.error("Failed to find run by ID.", error);
  }
};

module.exports = { client, getRunsCollection, getRunByID };

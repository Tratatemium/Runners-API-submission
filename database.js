const { MongoClient, ObjectId } = require("mongodb");
const { randomUUID } = require('crypto');

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
}

const getRunByID = async (runID) => {
    try {
        const selectedRun = await runs.find({
            _id: new ObjectId(runID)
        });
        result = await selectedRun.toArray();
        return result[0];
    } catch (error) {
        console.error("Failed to find run by ID.", error);
    }
}

const testDB = async () => {

    await client.connect();
    console.log("Connected to database.");
    const db = client.db("runners-app");
    runs = db.collection("runs");


    // await runs.insertOne({
    //     userId: randomUUID(),
    //     startTime: new Date().toISOString(),
    //     durationSec: Math.round((Math.random() * 1000)),
    //     distanceMeters: Math.round((Math.random() * 1000)),
    //     // paceAvgSecPerKm
    // });

    const count = await runs.countDocuments();
    console.log(`${count} runs data stored in database.`)

    const all = await runs.find();
    console.log(await all.toArray());

    console.log(await getRunByID('69626cbd2dd5f6fcsdgf0fe4'));
    console.log(await getRunByID('69625ec86cbd2dd5f6fc0fe4'));
    

    await client.close();
    console.log("Connection closed.");
}

testDB()


// await client.close();
// console.log("Connection closed.");



module.exports = { getRunsCollection };
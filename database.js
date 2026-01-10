const { MongoClient } = require("mongodb");
const { randomUUID } = require('crypto');

const client = new MongoClient("mongodb://localhost:27017");

let runs;

const connectDB = async () => {
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
        throw error;
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


    await client.close();
    console.log("Connection closed.");
}

testDB()


// await client.close();
// console.log("Connection closed.");



module.exports = { connectDB };
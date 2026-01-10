const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");

let runs;

const initDB = async () => {
    if (!runs) {
        await client.connect();
        console.log("Connected to database.");
        const db = client.db("runners-app");
        runs = db.collection("runs");
    }
}

initDB()


// await client.close();
// console.log("Connection closed.");
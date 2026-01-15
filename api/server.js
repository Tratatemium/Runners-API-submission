const app = require("./app");
const { connectDB } = require("../database.js")

const dotenv = require("dotenv");
if (!process.env.PORT) {
    dotenv.config();
}

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

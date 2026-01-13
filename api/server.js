const app = require("./app");

const dotenv = require("dotenv");
if (!process.env.PORT) {
    dotenv.config();
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

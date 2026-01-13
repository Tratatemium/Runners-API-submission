const express = require("express");
const router = express.Router();

const { getRunByID } = require("../../database.js");

router.get("/:id", async (req, res) => {
  try {
    const data = await getRunByID(req.params.id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send(`error: No run with ID ${req.params.id} found!`);
    }
  } catch (err) {
    if (!err.status || err.status >= 500) {
      console.error("Server error in /runs:", err);
    }
    res.status(err.status || 500).send(err.message);
  }
});

module.exports = router;

const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  res.send(`
    <h2>Post API</h>
    <p>Welcome to the Post API</p>
  `);
});

router.get("/api", (req, res) => {
  res.json({ message: "welcome to the Post API", })
})

module.exports = router

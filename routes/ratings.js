const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    db.query(`
    SELECT * FROM ratings
    ;`)
    .then(data => {
      const catgories = data.rows;
      res.json(catgories);
    })
    .catch(err => {
      console.log({ error: err.message })
      res
        .status(500)
        .json({ error: err.message });
    });
  });
  return router;
};

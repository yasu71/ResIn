const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/me", (req, res) => {

    const userId = req.session.user_id;
    if (!userId) {
      res.send({message: "not logged in"});
      return;
    }
    res.send(userId);
  });
  return router;
};

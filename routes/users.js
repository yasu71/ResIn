/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');

router.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

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

  // Retrieving user id cookie so it is available in resourceslist.js to retrieve resource list for that particular user
  router.get("/me", (req, res) => {

    const userId = req.session.user_id;
    if(!userId) {
      res.send({message: "not logged in"});
      return;
    }
    res.send(userId);
  });
  return router;
};

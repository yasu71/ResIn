const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');

router.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));


module.exports = (db) => {

  router.get("/:id", (req, res) => {
    req.session.user_id = req.params.id;
    res.redirect("/resources/:userid")
  });

  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });

  return router;
};

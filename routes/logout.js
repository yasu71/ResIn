const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    req.session.user_id = req.params.id;
    res.render("logout")
  });


  router.post("/", (req, res) => {
    req.session = null;
    res.redirect("/logout");
  });


  return router;
};

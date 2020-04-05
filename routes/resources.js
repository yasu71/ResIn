const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');

router.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

module.exports = (db) => {

  // My Resources Page for User once logged in
  router.get("/:userid", (req, res) => {
    console.log('Resources Get Returned');
    db.query(`SELECT * FROM resources WHERE user_id = ${req.params.userid};`)
      .then(data => {
        const resources = data.rows;
        res.json({ resources });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {

    // If user is not logged in the user will be redirected to login page and code will stop executing.
    const userId = req.session.user_id;
    if (!userId) {
      res.redirect('/login');
      return;
    }

    // The rest of this code will execute having passed login credentials
    const resourceUrl = req.body.url;
    const resourceTitle = req.body.title;
    const resourceDescription = req.body.description;
    const resourceCategory = 1; // <-- change to category and see how we can check if this category already exists in the category table *********

    console.log(req.body);
    if (!resourceDescription || !resourceTitle || !resourceUrl) { // <---- need to add userid and category to this one req.body as been added to these variables *********

      res.status(400).json({ error: 'invalid request: no data in POST body'});
    } else {
      db.query(`INSERT INTO resources (user_id, url, title, description, category_id) VALUES (${userId}, ${resourceUrl}, ${resourceTitle}, ${resourceDescription}, ${resourceCategory})`)
        .then(data => {
          const resources = data.rows;
          res.json({ resources });
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    }
  });

  return router;
};


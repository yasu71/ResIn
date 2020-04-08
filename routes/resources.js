const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');

router.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

module.exports = (db) => {

  // My Resources Page for User once logged in
  router.get("/user/:userid", (req, res) => {
    console.log('Resources Get Returned');

    db.query(`SELECT resources.*, ratings.* FROM resources LEFT OUTER JOIN ratings ON resources.id = resource_id WHERE resources.user_id = $1`, [`${req.params.userid}`])
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

  // Get request for the search feature,  search will convert table data and input to lowercase to compare before returning results to the searchform.js
  router.get("/search", (req, res) => {

    db.query(`SELECT resources.*, ratings.* FROM resources FULL OUTER JOIN ratings ON resources.id = resource_id WHERE LOWER(resources.title) LIKE LOWER($1) OR resources.description LIKE LOWER($1)`, [`%${req.query.search}%`])
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

  // Add new resource
  // req is request - what is received by the endpoint
  // res is response - what is sent back to the client
  router.post("/", (req, res) => {
    const userId = req.session.user_id;

    // If user is not logged in the user will be redirected to login page and code will stop executing.
    if (!userId) {
      res.redirect('/login');
      return;
    }

    // The rest of this code will execute having passed login credentials
    const resourceUrl = req.body.url;
    const resourceTitle = req.body.title;
    const resourceDescription = req.body.description;
    const resourceCategory = 0;
    const resourceImgUrl = req.body.img_url;


    console.log(`INSERT INTO resources (user_id, url, title, description, img_url) VALUES ($1, $2, $3, $4 ,$5)`, [`${userId}, ${resourceUrl}, ${resourceTitle}, ${resourceDescription}, ${resourceImgUrl}`]);

    if (!resourceDescription || !resourceTitle || !resourceUrl || !resourceImgUrl) { // <---- need to add userid and category to this one req.body as been added to these variables *********


      res.status(400).json({ error: 'invalid request: no data in POST body'});
    } else {
      db.query(`INSERT INTO resources (user_id, url, title, description, img_url) VALUES ($1, $2, $3, $4 ,$5) RETURNING *`, [`${userId}`, `${resourceUrl}`, `${resourceTitle}`, `${resourceDescription}`, `${resourceImgUrl}`])
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


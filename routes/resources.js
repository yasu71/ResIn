const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    console.log('Resources Get Returned');
    db.query(`SELECT * FROM resources`)
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


  // My Resources Page for User once logged in
  router.get("/user/:userid", (req, res) => {
    console.log('Resources Get Returned');


    db.query(`SELECT resources.*, AVG(ratings.rating) AS rating FROM resources LEFT OUTER JOIN ratings ON resources.id = resource_id WHERE resources.user_id = $1 GROUP BY resources.id`, [`${req.params.userid}`])

    //db.query(`SELECT  resources.*, ratings.rating
    //FROM resources
    //FULL OUTER JOIN ratings ON resources.id = ratings.resource_id
    //FULL OUTER JOIN likes ON resources.id = likes.resource_id
    //WHERE resources.user_id = $1 OR likes.user_id = $1
    //;`, [`${req.params.userid}`])

      .then(data => {
        const resources = data.rows;
        res.json({ resources });
      })
      .catch(err => {
        console.log({ error: err.message })
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Get request for the search feature,  search will convert table data and input to lowercase to compare before returning results to the searchform.js
  router.get("/search", (req, res) => {
console.log(req.query.search)

    db.query(`SELECT resources.*, AVG(ratings.rating) as rating, COUNT(liked.id) as liked_bool
    FROM resources
    FULL OUTER JOIN ratings ON resources.id = ratings.resource_id
    FULL OUTER JOIN (SELECT likes.id, likes.resource_id FROM likes WHERE likes.user_id = $1) as liked ON resources.id = liked.resource_id
    WHERE (LOWER(resources.title) LIKE LOWER('%' || $2 || '%') OR resources.description LIKE LOWER('%' || $2 || '%'))
    GROUP BY resources.id`, [req.session.user_id, req.query.search])
      .then(data => {
        const resources = data.rows;
        res.json({ resources });
      })
      .catch(err => {
        console.log({ error: err.message })
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

  // adding category to a resource
  router.post("/user/:userid/category/:categoryid", (req, res) => {
    console.log("category was added");
    const resourceId = req.body.resourceId;
    const categoryId = req.params.categoryid;
    db.query(`
    UPDATE resources
    SET category_id = $2
    WHERE resources.id = $1
    RETURNING *
    ;`, [resourceId, categoryId])
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


  // adding Like to a resource
  router.post("/user/:userid/resource/:resourceid", (req, res) => {
    console.log("Like was added");
    const user_id = req.params.userid;
    const resourceId = req.params.resourceid;
    db.query(`
    INSERT INTO likes (user_id, resource_id)
    VALUES ($1, $2)
    RETURNING *
    ;`, [user_id, resourceId])
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

  // adding ratings to a resource
  router.post("/user/:userid/rating/:rating", (req, res) => {
    console.log("Rating was added");
    const user_id = req.params.userid;
    const resourceId = req.body.resourceId;
    const rating = req.params.rating;
    db.query(`
    INSERT INTO ratings (user_id, resource_id, rating)
    VALUES ($1, $2, $3)
    RETURNING *
    ;`, [user_id, resourceId, rating])
      .then(data => {
        const resources = data.rows;
        res.json({ resources });
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ error: err.message });
      });
  });




  return router;
};


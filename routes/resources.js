const express = require('express');
const router  = express.Router();
// const cookieSession = require('cookie-session');

// router.use(cookieSession({
//   name: 'session',
//   keys: ['key1']
// }));

module.exports = (db) => {

  // My Resources Page for User once logged in
  router.get("/user/:userid", (req, res) => {
    console.log('Resources Get Returned');
    db.query(`SELECT resources.*, ratings.* FROM resources JOIN ratings ON resources.id = resource_id WHERE resources.user_id = ${req.params.userid};`)
      .then(data => {
        const resources = data.rows;
        res.render("resources");
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

    db.query(`SELECT *
    FROM resources, ratings
    WHERE resources.id = ratings.resource_id AND
    (LOWER(resources.title) LIKE LOWER('%${req.query.search}%') OR LOWER(resources.description) LIKE LOWER('%${req.query.search}%'))`)
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
    const userId = 1;
    //req.session.user_id;
    // if (!userId) {
    //   res.redirect('/login');
    //   return;
    // }

    // The rest of this code will execute having passed login credentials
    const resourceUrl = req.body.url;
    const resourceTitle = req.body.title;
    const resourceDescription = req.body.description;
    const resourceCategory = 1;
    const resourceImgUrl = req.body.img_url;

    // <-- change to category and see how we can check if this category already exists in the category table *********
    console.log(`INSERT INTO resources (user_id, url, title, description, img_url, category_id) VALUES (${userId}, ${resourceUrl}, ${resourceTitle}, ${resourceDescription}, ${resourceImgUrl}, ${resourceCategory})`)

    console.log(`${userId}, ${resourceUrl}, ${resourceTitle}, ${resourceDescription}, ${resourceImgUrl}, ${resourceCategory}`);
    if (!resourceDescription || !resourceTitle || !resourceUrl || !resourceImgUrl) { // <---- need to add userid and category to this one req.body as been added to these variables *********


      res.status(400).json({ error: 'invalid request: no data in POST body'});
    } else {
      db.query(`INSERT INTO resources (user_id, url, title, description, img_url, category_id) VALUES (${userId}, ${resourceUrl}, ${resourceTitle}, ${resourceDescription}, ${resourceImgUrl}, ${resourceCategory})`)
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
  router.post("/user/:userid/:categoryid", (req, res) => {
    // const resourceId = 2;
    // const resourceId = req.body.resource_id;
    const categoryId = req.params.categoryid;
    // ^each category in the dropdown should have caregories.id
    db.query(`
    UPDATE resources
    SET category_id = $2
    WHERE resources.id = $1
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
  router.post("/user/:userid/:resourceid", (req, res) => {
    const user_id = req.params.userid;
    const resourceId = req.params.resourceid;
    db.query(`
    INSERT INTO likes (user_id, resource_id)
    VALUES ($1, $2)
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
  // router.post("/user/:userid/:resourceid", (req, res) => {
  //   console.log("data", data)
  //   const user_id = req.params.userid;
  //   const resourceId = req.params.resourceid;
  //   const rating =
  //   db.query(`
  //   INSERT INTO ratings (user_id, resource_id, ratings)
  //   VALUES ($1, $2, $3)
  //   ;`, [user_id, resourceId, rating])
  //   .then(data => {
  //     const resources = data.rows;
  //     res.json({ resources });
  //   })
  //   .catch(err => {
  //     res
  //       .status(500)
  //       .json({ error: err.message });
  //   });
  // });



  return router;
};


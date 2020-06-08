const express = require('express');
const router = express.Router();

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

    let sql = `SELECT resources.*,
    AVG(ratings.rating) AS rating
    FROM resources
    LEFT OUTER JOIN ratings ON resources.id = ratings.resource_id
    WHERE resources.id
    IN (SELECT resources.id
        FROM resources
        WHERE user_id = $1
        UNION SELECT resource_id
        FROM likes
        WHERE user_id = $1)
        GROUP BY resources.id
    `;

    sql = `
      select
        rated_resources.*,
        comments.comment as comment_comment,
        cu.name as comment_user
      from (
        SELECT resources.*,
          AVG(ratings.rating) AS rating
        FROM resources
          LEFT OUTER JOIN ratings ON resources.id = ratings.resource_id
        WHERE resources.id in (
          select resources.id from resources where user_id = $1 union select resource_id from likes where user_id = $1
        )
        GROUP BY resources.id
      ) as rated_resources
        left outer join comments on comments.resource_id = rated_resources.id
        left outer join users as cu on comments.user_id = cu.id
      order by rated_resources.id, comments.id
    `

    db.query(sql, [req.params.userid])
      .then(data => {
        return data.rows;
      })
      .then(resources => {
        let ans = {};
        for (let res of resources) {
          if (res.id in ans) {
            ans[res.id].comments.push({user: res.comment_user, comment: res.comment_comment});
          } else {
            res.comments = [];
            if (res.comment_comment !== null) {
              res.comments.push({user: res.comment_user, comment: res.comment_comment});
            }
            delete res.comment_comment;
            delete res.comment_user;
            ans[res.id] = res;
          }
        }
        return Object.values(ans);
      })
      .then(resources => {
        res.json({ resources });
      })
      .catch(err => {
        console.log({ error: err.message });
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Get request for the search feature,  search will convert table data and input to lowercase to compare before returning results to the searchform.js
  router.get("/search", (req, res) => {

    let sql = `
      select
        rated_resources.*,
        comments.comment as comment_comment,
        cu.name as comment_user
      from (
        SELECT resources.*,
          AVG(ratings.rating) AS rating
        FROM resources
          LEFT OUTER JOIN ratings ON resources.id = ratings.resource_id
        WHERE resources.id in (
          select resources.id from resources WHERE (LOWER(resources.title) LIKE LOWER('%' || $1 || '%')
          OR resources.description LIKE LOWER('%' || $1 || '%'))
        )
        GROUP BY resources.id
      ) as rated_resources
        left outer join comments on comments.resource_id = rated_resources.id
        left outer join users as cu on comments.user_id = cu.id
      order by rated_resources.id, comments.id
    `

    db.query(sql, [req.query.search])
      .then(data => {
        return data.rows;
      })
      .then(resources => {
        let ans = {};
        for (let res of resources) {
          if (res.id in ans) {
            ans[res.id].comments.push({user: res.comment_user, comment: res.comment_comment});
          } else {
            res.comments = [];
            if (res.comment_comment !== null) {
              res.comments.push({user: res.comment_user, comment: res.comment_comment});
            }
            delete res.comment_comment;
            delete res.comment_user;
            ans[res.id] = res;
          }
        }
        return Object.values(ans);
      })
      .then(resources => {
        res.json({ resources });
      })
      .catch(err => {
        console.log({ error: err.message });
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Add new resource
  router.post("/", (req, res) => {
    const userId = req.session.user_id;
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

    if (!resourceDescription || !resourceTitle || !resourceUrl || !resourceImgUrl) {
      res.status(400).json({ error: 'invalid request: no data in POST body' });
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


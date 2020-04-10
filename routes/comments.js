const express = require('express');
const router  = express.Router();

module.exports = (db) => {


  router.get("/resource/:resourceid", function(req, res) {
    console.log('this is in comments.js', req.params);
    db.query(`SELECT *
    FROM comments
    JOIN resources ON resource_id = resources.id
    WHERE resource_id = ($1)`, [`${req.params.resourceid}`])
      .then(data => {
        const comments = data.rows;
        res.json(comments);
      })
      .catch(err => {
        res.status(500)
          .json({ error: err.message });
      });
  });



  router.post("/", function(req, res) {
    const comment = req.body.comment_box;
    const userid = req.session.user_id;
    const resource = req.body.resource_id;
    console.log(comment, userid, resource);

    if (!req.body.comment_box) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    db.query('INSERT INTO comments (user_id, resource_id, comment) VALUES ($1, $2, $3) RETURNING *', [`${userid}`, `${resource}`, `${comment}`])
      .then(data => {
        const comments = data.row;
        res.json({ comments });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

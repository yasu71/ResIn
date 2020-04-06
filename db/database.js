module.exports = (db) => {
  /**
   * Get all resources for a single user.
   * @param {string} user_id The id of the user.
   * @return {Promise<[{}]>} A promise to the resources and categories.
   */
  const getAllResources = (user_id, limit = 12) => {

    return db.query(`
    SELECT resources.*, categories.*
    FROM resources
    JOIN categories ON categories.id = category_id
    WHERE resources.user_id = $1
    GROUP BY resources.id, categories.id
    ORDER BY resources.id DESC
    LIMIT $2
    ;`, [user_id, limit])
    .then((res) => {
      if (res.rows.length === 0) {
        return null;
      } else {
        return res.rows;
      }
    })
    .catch((err) => {
      console.error(err);
    });

  };

  /**
   * Add a property to the database
   * @param {{}} resource An object containing all of the resource details.
   * @return {Promise<{}>} A promise to the property.
   */

  const addResources = (resource) => {

    return db.query(`
    INSERT INTO resources (
      user_id,
      category_id,
      url,
      title,
      description)
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5)
    RETURNING *
    ;`, [resource.user_id, resource.category_id, resource.url, resource.title, resource.descrption])
    .then((res) => {
      if (res.rows.length === 0) {
        return null;
      } else {
        return res.rows[0];
      }
    })
    .catch((err) => {
      console.error(err);
    });

  };

  return {
    getAllResources,
    addResources,
  }

};

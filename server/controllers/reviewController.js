const db = require('../database/model.js');
const reviewController = {};

reviewController.getReviewsByEmail = async (req, res, next) => {
  // assumes that email will be passed in from URL params

  const email = req.params.email;
  const sqlCommand = `
    SELECT * FROM Reviews
    WHERE email = $1;
  `;
  const values = [email];
  await db.query(sqlCommand, values, (err, result) => {
    if (err) return next('Error in reviewController.getReviewsByEmail: getting user\'s reviews from Reviews table in the database');
    res.reviews = result.rows;
  });
  return next();
}

reviewController.getReviewsByProduce = async (req, res, next) => {
  // assumes that email will be passed in from URL params

  const produce = req.params.produce;
  const sqlCommand = `
    SELECT * FROM Reviews
    WHERE produce = $1;
  `;
  const values = [produce];
  await db.query(sqlCommand, values, (err, result) => {
    if (err) return next('Error in reviewController.getReviewsByProduce: getting all reviews for the produce from Reviews table in the database');
    res.reviews = result.rows;
  });
  return next();
}

reviewController.updateReview = async (req, res, next) => {
  // assumes that data will be passed in from req.body

  const { review_id, description } = req.body;

  const sqlCommand = `
    UPDATE Reviews
    SET description = $2
    WHERE review_id = $1
    RETURNING *;
  `;
  const values = [review_id, description];

  await db.query(sqlCommand, values, (err, result) => {
    if (err) return next('Error in reviewController.updateReview: updating user\'s review to Reviews table in the database');
    res.reviews = result.rows[0];
  });

  return next();
};

reviewController.deleteReview = async (req, res, next) => {
  // assumes that data will be passed in from URL params

  const reviewId = req.params.reviewId;
  const sqlCommand = `
    DELETE FROM Reviews
    WHERE review_id = $1;
  `;

  await db.query(sqlCommand, values, (err, result) => {
    if (err) return next('Error in reviewController.deleteReview: deleting user\'s review to Reviews table in the database');
    res.confirmDelete = 'Review deleted';
  });

  return next();
};

reviewController.createReview = async (req, res, next) => {
  // assumes that user email, produce will be passed in from req.body

  const { email, produce, farm, description } = req.body;

  const sqlCommand = `
    INSERT INTO Reviews (email, produce, farm, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [email, produce, farm, description];

  await db.query(sqlCommand, values, (err, result) => {
    if (err) return next('Error in reviewController.createReview: writing user\'s review to Reviews table in the database');
    res.reviews = result.rows[0];
  });

  return next();
};

module.exports = reviewController;

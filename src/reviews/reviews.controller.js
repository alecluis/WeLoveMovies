//reviews.controller.js

const service = require("./reviews.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function checkReview(req, res, next) {
  const review = await service.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

async function update(req, res, next) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  try {
    const data = await service.update(updatedReview);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function destroy(req, res) {
  const { review } = res.locals;
  await service.delete(review.review_id);
  res.sendStatus(204);
}

module.exports = {
  update: [asyncErrorBoundary(checkReview), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(checkReview), asyncErrorBoundary(destroy)],
};

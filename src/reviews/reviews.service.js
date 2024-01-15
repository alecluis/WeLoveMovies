//reviews.service.js
const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function read(reviewId) {
  return knex("reviews")
    .select("*")
    .where("review_id", reviewId)
    .first();
}

async function update(updatedReview) {
  await knex("reviews").where("review_id", updatedReview.review_id).update(updatedReview);
  return getReviewWithCritic(updatedReview.review_id);
}

function destroy(reviewId) {
  return knex("reviews")
    .where("review_id", reviewId)
    .del();
}

function getReviewWithCritic(reviewId) {
  const addCritic = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
  });

  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where("r.review_id", reviewId)
    .then((reviews) => reviews.map((review) => addCritic(review)))
    .then((review) => review[0]);
}

module.exports = {
  read,
  update,
  delete: destroy,
};

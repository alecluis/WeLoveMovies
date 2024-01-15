//movies.controller.js

const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function checkMovieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie.length > 0) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

async function list(req, res, next) {
  const movieShowing = req.query.is_showing;
  if (movieShowing !== undefined) {
    const data = await service.movieShowing();
    res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data });
  }
}

function read(req, res, next) {
  const { movie: [data], } = res.locals;
  res.json({ data });
}

async function theaters(req, res, next) {
  const data = await service.theaters(req.params.movieId);
  res.json({ data });
}

async function reviews(movieId) {
  return service.reviews(movieId);
}

function critic(reviews) {
  return service.critic(reviews);
}

async function reviewsCritic(req, res, next) {
  try {
    const reviewsData = await reviews(req.params.movieId);
    const mappedReviews = critic(reviewsData);
    res.json({ data: mappedReviews });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(checkMovieExists), read],
  theaters: [asyncErrorBoundary(checkMovieExists), theaters],
  reviewsCritic: [asyncErrorBoundary(checkMovieExists), reviewsCritic],
};
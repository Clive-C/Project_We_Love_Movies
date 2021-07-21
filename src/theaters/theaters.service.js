const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
});

function list() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .then(reduceMovies);
}

function listTheatersByMovieId(movieId) {
  return knex("theaters as t")
    .join("movie_theaters as mt", "t.theater_id", "mt.theater_id")
    .select("theaters.*", "mt.is_showing", "mt.movie_id")
    .where({ movie_id: movieId });
}

module.exports = {
  list,
  listTheatersByMovieId,
};
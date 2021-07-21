const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function list(){
    return knex("movies").select("*");
}

function isShowing() {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .select("m.*")
        .where({ is_showing: true })
        .groupBy("m.movie_id");
}

function read(movieId) {
    return knex("movies")
        .select("*")
        .where({ movie_id: movieId })
        .first();
}

function showTheaters(movieId) {
    return knex("movies_theaters as mt")
        .join("theaters as t", "mt.theater_id", "t.theater_id")
        .select("*")
        .where({ movie_id: movieId, is_showing: true })
}

const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
});

function showReviews(movieId) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("*")
        .where({ movie_id: movieId })
        .then((result) => {
            const returnList = [];
            result.forEach((item) => {
                const itemWithCritic = addCritic(item);
                returnList.push(itemWithCritic);
            });
            return returnList;
        });
}

module.exports ={
    list,
    isShowing,
    read,
    showTheaters,
    showReviews
}
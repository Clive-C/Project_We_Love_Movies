const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function read(reviewId) {
    return knex("reviews")
        .select("*")
        .where( {review_id: reviewId })
        .first();
}

const addCritic = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
});

function updateRecord(updatedReview) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("*")
        .where({ review_id: updatedReview.review_id})
        .update(updatedReview, "*")
}

async function update(updatedReview, reviewId) {
    
    await updateRecord(updatedReview);
    
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("*")
        .where({ review_id: reviewId })
        .first()
        .then((data) => addCritic(data))
        .then((newData) => {
            const result = {...newData, created_at: toString(Date.now()), updated_at: toString(Date.now())}
            return result;
        })
}

function destroy(reviewId) {
    return knex("reviews").where({ review_id: reviewId }).del();
}

module.exports = {
    read,
    update,
    delete: destroy
}
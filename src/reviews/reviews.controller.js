const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req,res,next) {
    const review = await service.read(req.params.reviewId);
    if(review){
        res.locals.review = review;
        return next();
    }
    next({
        status: 404,
        message: `Review cannot be found`
    });
}

async function update(req,res) {
    const reviewId = res.locals.review.review_id; 
    const updatedReview = {
        ...req.body.data,
        review_id: reviewId,
    };
    res.json({ data: await service.update(updatedReview, reviewId) });
}

async function destroy(req,res) {
    await service.delete(res.locals.review.review_id);
    res.sendStatus(204);
}

module.exports ={
    update:[
        asyncErrorBoundary(reviewExists),
        asyncErrorBoundary(update)
    ],
    delete: [
        asyncErrorBoundary(reviewExists),
        destroy
    ]
}


const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
    const isShowing = req.query.is_showing;
    
    if(isShowing) {
        res.json({ data: await service.isShowing() });
    } else {
        res.json({ data: await service.list() });
    }
}

async function movieExists (req, res, next) {
    const movie = await service.read(req.params.movieId);
    if (movie) {
        res.locals.movie = movie;
        return next();
    }
    next({
        status: 404,
        message: `Movie cannot be found.`
    });
}

function read(req, res) {
    const { movie: data } = res.locals;
    res.json( {data} );
}

async function showTheaters(req,res) {
    res.json({ data: await service.showTheaters(req.params.movieId)});
}

async function showReviews(req,res) {
    res.json({ data: await service.showReviews(req.params.movieId)});
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [
        asyncErrorBoundary(movieExists),
        read,
    ],
    showTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(showTheaters)],
    showReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(showReviews)],

}
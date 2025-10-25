const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { ListingSchema , reviewSchema } = require("./schema.js");
const e = require("connect-flash");

module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.user);
    if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash("error", "You must be signed in first!");
      return res.redirect("/login");
    }
    next();
  };

  module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.returnTo) {
     res.locals.redirectUrl = req.session.returnTo;
      delete req.session.returnTo;
    }
    next();
  };

  module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error", "You do not have permission to do that!");
      return res.redirect(`/listings/${id}`);
    }
    next();
  };

  module.exports.validateListing = (req, res, next) => {
  const { error } = ListingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
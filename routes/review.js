const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const { validateReview, isLoggedIn } = require("../middleware.js")


//post review route
router.post(
  "/",
  isLoggedIn ,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new ExpressError(404, "Listing Not Found");
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id ;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Created new review!");
    res.redirect(`/listings/${listing._id}`);
  })
);

//delete review route
router.delete(
  "/:reviewId",
  isLoggedIn ,

  wrapAsync(async (req, res) => {   
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
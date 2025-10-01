const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { ListingSchema } = require("../schema.js");

// ----------------------- Middlewares -----------------------
const validateListing = (req, res, next) => {
  const { error } = ListingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New Route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route (with reviews populated)
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      throw new ExpressError(404, "Listing Not Found");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// Create Route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing Not Found");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// Update Route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { new: true }
    );
    if (!updatedListing) {
      throw new ExpressError(404, "Listing Not Found");
    }
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      throw new ExpressError(404, "Listing Not Found");
    }
    res.redirect("/listings");
  })
);

module.exports = router;
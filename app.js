const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { ListingSchema, reviewSchema } = require("./schema.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("✅ Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// ----------------------- App Config -----------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// ----------------------- Middlewares -----------------------
const validateListing = (req, res, next) => {
  const { error } = ListingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// ----------------------- Routes -----------------------
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route (with reviews populated)
app.get(
  "/listings/:id",
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
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Edit Route
app.get(
  "/listings/:id/edit",
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
app.put(
  "/listings/:id",
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
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      throw new ExpressError(404, "Listing Not Found");
    }
    res.redirect("/listings");
  })
);

// Reviews Create Route
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new ExpressError(404, "Listing Not Found");
    }
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  })
);

//delete review route
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {   
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

// ----------------------- Error Handling -----------------------
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// ----------------------- Server -----------------------
app.listen(8080, () => {
  console.log("🚀 Server running on port 8080");
});

// ----------------------- Cascade Delete Middleware -----------------------
// Add this in listing model file (models/listing.js)
// listingSchema.post("findOneAndDelete", async function (listing) {
//   if (listing) {
//     await Review.deleteMany({ _id: { $in: listing.reviews } });
//   }
// });

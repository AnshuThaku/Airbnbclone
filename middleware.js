const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingSchema, reviewschema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in!");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }

  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "you are not authorized to do this");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// middleware validation schema

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errmsg);
  }

  // Validate file presence if creating a new listing
  if (!req.file) {
    throw new ExpressError(400, "Image is required for a listing.");
  }

  next();
};

// review validation

module.exports.validatereview = (req, res, next) => {
  let { error } = reviewschema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

module.exports.isreviewAuthor = async (req, res, next) => {
  let { id, reviewid } = req.params;
  let review = await Review.findById(reviewid);
  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not authorized to do this");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

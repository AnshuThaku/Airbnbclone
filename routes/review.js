const express = require("express");
const router = express.Router({ mergeParams: true });
const Wrapasync = require("../utils/Wrapasync.js");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validatereview } = require("../middleware.js");
const { isloggedin, isreviewAuthor } = require("../middleware.js");
const reviewcontroller = require("../controllers/reviews.js");

//review route
//post route

router.post(
  "/",
  isloggedin,
  validatereview,
  Wrapasync(reviewcontroller.createReview)
);

//delete review route
router.delete(
  "/:reviewid",
  isloggedin,
  isreviewAuthor,
  Wrapasync(reviewcontroller.deleteReview)
);

module.exports = router;

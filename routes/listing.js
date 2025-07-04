const express = require("express");
const router = express.Router();
const Wrapasync = require("../utils/Wrapasync.js");
const Listing = require("../models/listing.js");
const { isloggedin, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(Wrapasync(listingController.index))
  .post(
    isloggedin,
    upload.single("image"),
    validateListing,
    Wrapasync(listingController.create)
  );

// new route
router.get("/new", isloggedin, listingController.new);

//searching
router.get("/search", Wrapasync(listingController.searchListings));

router
  .route("/:id")
  .get(Wrapasync(listingController.show))
  .put(
    isloggedin,
    isOwner,
    upload.single("image"),
    validateListing,
    Wrapasync(listingController.update)
  )

  .delete(isloggedin, isOwner, Wrapasync(listingController.delete));

//edit route
router.get("/:id/edit", isloggedin, isOwner, Wrapasync(listingController.edit));

//filtering
router.get("/filter/:category", Wrapasync(listingController.filterCategory));
module.exports = router;

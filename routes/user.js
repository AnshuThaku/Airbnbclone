const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport = require("passport");
const Wrapasync = require('../utils/Wrapasync');
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller=require("../controllers/user.js");


router.route("/signup")
.get(usercontroller.rendersignup)
.post(Wrapasync(
    usercontroller.signup
));


router.route("/login")
.get(
    usercontroller.renderlogin
)
.post(saveRedirectUrl,
    passport.authenticate("local",
    {failureRedirect:'/login',
    failureFlash:true}),
    
usercontroller.login
);


router.get("/logout",
    usercontroller.logout
);
    
module.exports=router;
const User = require("../models/user");

module.exports.rendersignup = (req, res) => {
  res.render("users/signup");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, password, email } = req.body;
    const newuser = new User({ email, username });
    const registereduser = await User.register(newuser, password);
    console.log(registereduser);
    req.login(registereduser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "logged in successfully");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderlogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "welcome back to wanderlust you are logged in");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  delete req.session.redirectUrl; // Clear the redirect URL from session

  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "logged out successfully");
    res.redirect("/listings");
  });
};

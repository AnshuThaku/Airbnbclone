if(process.env.NODE_ENV!="production"){
  require('dotenv').config();
  }
  
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path=require("path");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js")
const mongostore=require('connect-mongo');
const ListingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require('./routes/user.js');
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const Localstrategy=require("passport-local");
const User=require('./models/user.js');
const e = require('connect-flash');



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl=process.env.AtlasDB_url;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}


// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });




const store=mongostore.create({

  mongoUrl:dburl,
  crypto:{
   secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})
store.on("error",()=>{
  console.log("Error in mongo session store",err)
})

// session
const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveuninitialized:false,
  cookie:{
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7,
    httpOnly:true,
  },
};




  



app.use(session(sessionOptions))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error = req.flash('error');
  res.locals.currentUser=req.user;
  next();
  });

app.use("/listings",ListingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not found"))
})

// // define mioddleware
app.use((err,req,res,next)=>{
  let {statuscode=500,message="Something Went wrong"}=err;
  res.status(statuscode).render("error.ejs",{message});
// res.status(statuscode).send(message);
})

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
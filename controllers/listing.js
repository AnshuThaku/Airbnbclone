const Listing = require("../models/listing");


module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index", { allListings });
  };

  
  module.exports.new= (req, res) => {
    res.render("listings/new.ejs");
  };


  module.exports.show=async(req,res)=>{
    let {id}=req.params;
     const listing=await Listing.findById(id).populate({
      path: "reviews",
     populate:{
      path:"author",
     }
    }).populate("owner");
     if(!listing){
      req.flash("error","listing you are looking for does not exist");
      return res.redirect("/listings");
     }
     console.log(listing);
     res.render("listings/show",{listing});
    };
  

    module.exports.create=async(req,res,next)=>{
     let url= req.file.path;
      let filename=req.file.filename;
      const newlisting=new Listing(req.body.Listing);
      newlisting.owner=req.user._id;
      newlisting.image={url,filename};
      await newlisting.save();
      req.flash("success","new listing created");
    res.redirect("/listings");
    };

    module.exports.edit=async(req,res)=>{
      let {id}=req.params;
       const listing=await Listing.findById(id);
       if(!listing){
        req.flash("error","listing you are looking for does not exist");
         res.redirect("/listings");
       }
       let originaImageUrl=listing.image.url;
       originaImageUrl=originaImageUrl.replace("upload","/upload/w_250");
      res.render("listings/edit.ejs",{listing,originaImageUrl})
    };


    module.exports.update=async(req,res)=>{
      let {id}=req.params;
     let listing= await Listing.findByIdAndUpdate(id,{...req.body.Listing});
     if(typeof req.file!=="undefined"){
     let url= req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
     }

      req.flash("success"," Listing updated ");
  
      res.redirect(`/listings/${id}`);
    };

    module.exports.delete=async(req,res)=>{
        let {id}=req.params;
       let deletedlisting=await Listing.findByIdAndDelete(id);
        req.flash("success"," listing deleted");
    
       res.redirect("/listings");
    };
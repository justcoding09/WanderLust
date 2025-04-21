const Listing=require('../models/listing');

module.exports.index=async (req,res)=>{
    let listing=await Listing.find({});
    res.render("listings/index",{listing})
};

module.exports.renderNew=(req,res)=>{
    res.render("listings/new");
};

module.exports.show=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
    console.log(listing.owner.username);
    if(!listing)
        next(new ExpressError(403,"Id not found"));
    res.render("listings/show",{listing});
};

module.exports.create=async (req,res,next)=>{
        let url=req.file.path;
        let filename=req.file.filename;
        const list=new Listing(req.body.listing);
        // if(!req.body.listing)
        //     throw new ExpressError("Send valid data for Listing.");
        list.owner=req.user._id;
        list.image={url,filename};
        await list.save();
        req.flash("success","New Listing Created!!!");
        res.redirect('/listings'); 
};

module.exports.editForm=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let orgImage=listing.image.url;
    orgImage=orgImage.replace("/upload","/upload/w_250");
    res.render("listings/edit",{listing,orgImage});
};

module.exports.editingListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated!!!");
    res.redirect(`/listings/${id}`);
};

module.exports.delete=async (req,res)=>{
    let {id}=req.params;
    let del=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!!!");
    res.redirect("/listings");
};
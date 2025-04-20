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
        const list=new Listing(req.body.listing);
        // if(!req.body.listing)
        //     throw new ExpressError("Send valid data for Listing.");
        list.owner=req.user._id;
        await list.save();
        req.flash("success","New Listing Created!!!");
        res.redirect('/listings'); 
};

module.exports.editForm=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("edit",{listing});
};

module.exports.editingListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!!!");
    res.redirect(`/listings/${id}`);
};

module.exports.delete=async (req,res)=>{
    let {id}=req.params;
    let del=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!!!");
    res.redirect("/listings");
};
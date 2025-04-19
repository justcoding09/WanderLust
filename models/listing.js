const mongoose=require('mongoose');
const Review=require('./review.js');
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        required:false,
        type:String,
        default:"https://unsplash.com/photos/landscape-photography-of-brown-mountains-and-river-uXTozY3CcQg",
        set:(v)=>(v===" " || v==null )?"https://unsplash.com/photos/landscape-photography-of-brown-mountains-and-river-uXTozY3CcQg":v,
    },
    price:Number,
    location:String,
    country:String,
    review:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.review}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
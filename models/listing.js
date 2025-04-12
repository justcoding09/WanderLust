const mongoose=require('mongoose');
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
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
    ]
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
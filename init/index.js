const mongoose=require('mongoose');
const initdata=require('./data.js');
const Listing=require('../models/listing');

main().then(()=>console.log(`WANDERLUST`)).catch((err)=>console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"6802871b1ea1d08320f54d92"}));
    await Listing.insertMany(initdata.data);
}

initDB();
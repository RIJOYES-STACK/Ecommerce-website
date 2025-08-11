const mongoose=require('mongoose');

const productschema=new mongoose.Schema({
    name:String,
    description:String,
    price:Number,
    image:[String],
    category:String,
    stock:Number,
    createAt:{type:Date,default:Date.now()}

});
module.exports=mongoose.model('product',productschema)
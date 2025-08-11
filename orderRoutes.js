const express=require('express');
const router=express.Router();
const order=require('../models/order');
const {verifyuser}=require('../middleware/Authuser');

//place orders
router.post('/place',verifyuser,async(req,res)=>{
    try{
        const{products,totalAmount,shippingAddress}=req.body;
       const neworder=new order({
        userId:req.user.id,
        products,
        totalAmount,
        shippingAddress
       });
       await neworder.save();
       res.status(201).json(neworder);

    }catch(err){
        console.error(err);
    }

});

// view all orders

router.get('/order',verifyuser,async(req,res)=>{
    try{
    const Order=await order.find({userId:req.user.id}).populate('products.productId');
    res.status(201).json(Order);
    }catch(err){
        console.error(err)
    }

});

// get specific order by id
router.get('/:orderid',verifyuser,async(req,res)=>{
    try{
        const Order=await order.findOne({_id:req.params.orderid,userId:req.user.id}).populate('products.productId');
        if(!Order){
            res.status(404).json({message:"Order not found"});
        }
        res.status(201).json(Order);
    }catch(err){
        console.error(err);
    }
});

// update order status
router.put('/:orderid/shipping',verifyuser,async(req,res)=>{
    try{
        const {shippingAddress}=req.body;
        const Order=await order.findByIdAndUpdate({_id:req.params.orderid},{shippingAddress},{new:true});
        if(!Order){
            res.status(404).json({message:"order not found"});
        }
        res.status(201).json(Order);


    }catch(err){
        console.error(err);
        res.status(500).json({message:"Error updating the order status"});
    }
 
});

// Delete an order
router.delete('/:orderid',verifyuser,async(req,res)=>{
    try {
        const deletedorder=await order.findByIdAndDelete({_id:req.params.orderid,userId:req.user.id});
        if(!deletedorder){
            res.status(404).json({message:"order not found"});
        }
        res.status(201).json({message:"order has been deleted successfully"});

        
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"internal server error"});
        
    }

});




module.exports=router;
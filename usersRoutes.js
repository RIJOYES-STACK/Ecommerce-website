const express=require('express');
const bcrypt=require('bcryptjs');
const router=express.Router();
const jwt=require('jsonwebtoken');
const user=require('../models/users');
const cart=require('../models/carts');
const {verifyuser}=require('../middleware/Authuser');

// user registration
router.post('/register',async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        const existinguser=await user.findOne({email});
        if(existinguser){
            res.json({message:"user already exists"});
        }
        const hashedpassword=await bcrypt.hash(password,10);
        const User=new user({name,email,password:hashedpassword});
        await User.save();
        res.status(201).json({message:"user have been registerd",User});
    }catch(err){
        console.error(err);
    }
});

router.post('/login',async(req,res)=>{
    try{
        const{email,password}=req.body;
        const User=await user.findOne({email});
        if(!User){
            res.status(404).json({message:"user not found"});
        }
        const ismatch=await bcrypt.compare(password,User.password);
        if(!ismatch){
            res.status(404).json({message:"invalid password"});
        }
        const token=jwt.sign({id:User._id,role:User.role},process.env.JWT_SECRET,{expiresIn:"1h"});
        res.status(201).json({message:"loggin successfully",token,role:User.role});

    }catch(err){
        console.error(err);
    }
});
    //   user profile
router.get('/profile',verifyuser,async(req,res)=>{
    try{
    const User=await user.findById(req.user.id);
    res.json(User);
    }catch(err){
        console.error(err);
    }
});

//user cart
router.get('/cart',verifyuser,async(req,res)=>{
    try{
        const Cart=await cart.findOne({userId:req.user.id});
        if(!Cart){
            res.status(404).json({message:"cart not found"});
        }
        res.json(Cart);
    }catch(err){
        console.error(err)
    }


});


module.exports=router;
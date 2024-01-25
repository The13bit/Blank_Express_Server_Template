/**
 * -----------------------------------------------------------------------------
 * WARNING: This code base is obsolete and is only for reference purposes.
 * Please do not use this for any active development.
 * -----------------------------------------------------------------------------
 */

import {catchAsyncError} from '../middleware/CatchAsyncError.js'
import ErrorHandler from '../utils/errorHandler.js'
import { User } from '../Models/Ref_model2.js';
import { sendToken } from '../utils/sendToken.js';

export const register=catchAsyncError(async(req,res,next)=>{
    const {name,email,password}=req.body;   
    
    if(!name || !email || !password){
        return next(new ErrorHandler("Please enter all fields",400))
    }

    let user = await User.findOne({email});

    if (user){
        return next(new ErrorHandler("User already exists",409))
    }
    user =await User.create({
        name,
        email,
        password,
    });
    sendToken(res,user,"User registered successfully",201);

});

export const login=catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;   
    
    if( !email || !password){
        return next(new ErrorHandler("Please enter all fields",400))
    }

    const user = await User.findOne({email}).select("+password");

    if (!user){
        return next(new ErrorHandler("Invalid credentials",401))
    }
    const isMatch=await user.comparePassword(password);

    if(!isMatch) return next(new ErrorHandler("Invalid credentials",401));


    sendToken(res,user,`Login succesful ${user.name}`,200);

});

export const logout=catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    }).json({
        success:true,
        message:"Logged out"
    })

});
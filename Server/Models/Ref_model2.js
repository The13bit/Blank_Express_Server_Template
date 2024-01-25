/**
 * -----------------------------------------------------------------------------
 * WARNING: This code base is obsolete and is only for reference purposes.
 * Please do not use this for any active development.
 * -----------------------------------------------------------------------------
 */

import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import e from 'express';
const schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],

    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validator:[validator.isEmail,"Please enter valid email"]
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minlength:6,
        select:false
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    ResetPasswordToken:String,
    ResetPasswordExpire:String



});

schema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);

    next();
    
})

schema.methods.getJwtToken=function(){
    return jwt.sign({_id:this._id},process.env.JWT,{
        expiresIn:"15d"
    });
};

schema.methods.comparePassword=async function(enteredPassword){
    console.log(this.password)
    console.log(enteredPassword)
    return await bcrypt.compare(enteredPassword,this.password);
}



export const User=mongoose.model("User",schema)
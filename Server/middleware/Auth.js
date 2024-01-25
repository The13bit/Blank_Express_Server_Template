import jwt from 'jsonwebtoken';
import { catchAsyncError } from './CatchAsyncError.js';
import ErrorHandler from '../utils/errorHandler.js';
import {User} from "../Models/Ref_model2.js";




export const auth = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Login first to access this resource", 401));
    }
    const decoded = jwt.verify(token,process.env.JWT);
    
    req.user = await User.findById(decoded._id);
    next();
})

export const authorizeadmin=(req,res,next)=>{
    if(req.user.role!=="admin"){
        return next(new ErrorHandler(`Role: ${req.user.role} is not authorized to access this resource`,403))
    }
}
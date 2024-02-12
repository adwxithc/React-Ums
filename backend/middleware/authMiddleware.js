import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../Models/userModel.js'

const protect = asyncHandler(async(req,res,next)=>{
    
    const token =req.cookies.jwt
    if(token){
        try {
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            req.user=await User.findById(decoded.userId).select('-password')
          
            if(!req?.user?.isBlocked){
                next()
            }else{
                res.cookie('jwt','',{
                    httpOnly:true,
                    expires: new Date(0)
                })
                res.status(401).json({success:false})
            }
            
            
        } catch (error) {
            console.log(error);
            res.status(401)
            throw new Error('Not autherized, invalid token')
        }
    }else{
        res.status(401)
        throw new Error('Not autherized, no token')
    }
})

const protectAdmin = asyncHandler(async(req,res,next)=>{
   
    const token =req.cookies.jwt
    if(token){
        try {
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            req.user=await User.findById(decoded.userId).select('-password')
            if(req.user.isAdmin){
                next()
            }else{
                res.status(401)
                throw new Error('Not autherized, access denied')
            }
            
            
        } catch (error) {
            console.log(error);
            res.status(401)
            throw new Error('Not autherized, invalid token')
        }
    }else{
        res.status(401)
        throw new Error('Not autherized, no token')
    }
})

export{
    protect,
    protectAdmin
}
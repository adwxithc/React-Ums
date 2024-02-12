import asyncHandler from 'express-async-handler'
import User from '../Models/userModel.js'
import generateToken from '../utils/generateToken.js'
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Auth user/set token
// route    POST /api/users/auth
//@access   Public
const authUser= asyncHandler(async(req, res)=>{
    const {
        email,
        password
    } = req.body
    const user =await User.findOne({email:email})
    if(user && (await user.matchPassword(password))){
        generateToken(res, user._id)
        res.status(201).json({
            success:true,
            id:user._id,
            name:user.name,
            email:user.email,
            profile:user.profile,
            isBlocked:user.isBlocked,
            isAdmin:user.isAdmin

        })
    }else{
        res.status(400)
        throw new Error('invalid email or password')
    }
})

// @desc    Register a new user
// route    POST /api/users/
// @access  Public
const registerUser=asyncHandler(async(req, res)=>{
    const{
        name,
        email,
        password
    } = req.body
    const userExist =await User.findOne({email:email})
    if(userExist){
        res.status(400)
        throw new Error('User Already Exist')
    }

    const user = await User.create({
        name,
        email,
        password
    })
    if(user){
        generateToken(res, user._id)
        res.status(201).json({
            success:true,
            id:user._id,
            name:user.name,
            email:user.email,
            isBlocked:user.isBlocked,
            profile:user.profile
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    logout the user
//route     POST /api/users/logout
//@access   Public
const logoutUser= asyncHandler(async(req, res)=>{
   
    res.cookie('jwt','',{
        httpOnly:true,
        expires: new Date(0)
    })
    res.status(200).json({success:true})

})

// @desc    Get user profile
// route    GET /api/users/profile
// access   Privet
const getUserProfile=asyncHandler(async(req, res)=>{
    const user={
        _id:req.user._id,
        name:req.user.name,
        email:req.user.email,
        profile:req.user.profile
    }
    res.status(200).json(user)
})

// @desc    Update user profile
// route    PUT /api/users/profile
// access   privet
const updateUserProfile=asyncHandler(async(req, res)=>{
    const user = await User.findById(req.user._id)
    if(user){
        user.name=req.body.name || req.user.name
        user.email=req.body.email || req.user.email
        if(req.body.password){ 
            user.password=req.body.password
        }
        const updatedUser = await user.save()
        res.status(200).json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            isBlocked:updatedUser.isBlocked,
            profile:updatedUser.profile
          
        })

    }else{
        res.status(404)
        throw new Error('user not found')
    }
})

// @desc upload user profile/ update user profile
// route PUT /api/users/profile-image
// @access Privet
const uploadProfileImage=asyncHandler( async(req, res)=>{
    const image = req.file;
    const {user} = req
   
    if(user.profile){
        const oldImagePath=path.join(__dirname, '..','..', 'public/profilePic', user.profile);
        try {
            await fs.unlinkSync(oldImagePath);
        } catch (error) {
            console.log('old image deletion failed',error);
        }
    }
    user.profile=image.filename

   
    
    const updatedUser = await user.save()
    res.status(200).json({
        _id:updatedUser._id,
        name:updatedUser.name,
        email:updatedUser.email,
        isBlocked:updatedUser.isBlocked,
        profile:updatedUser.profile
    })
})

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    uploadProfileImage
}
import asyncHandler from 'express-async-handler'
import User from '../Models/userModel.js'



// @desc    get users list
// route    GET /api/admin/users-list
// @access  Private
const userList =asyncHandler( async(req, res) => {
     
    const {page=1,limit=4,key=''}=req.query
    
    const users = await User.find({
        $and: [
            { isAdmin: false,isDeleted:false },
            { name: { $regex: new RegExp(`^${key}`, 'i') } }
          ]
    }).sort({ updatedAt: -1 }) 
      .skip((page - 1) * limit) 
      .limit(limit) 
      .select('-password');

    const totalUsers = await User.countDocuments();
    const lastPage = Math.ceil(totalUsers / limit);

    res.status(200).json({
        page,
        users,
        lastPage
    })
})

// @desc    update user info/ block user
// route    PUT /api/admin/update-user
// @access  Private
const updateUser= asyncHandler( async(req, res)=>{
    
    const {id,email,name,isBlocked}=req.body
    const user = await User.findById(id)
  
    if(user){
        
        
        user.email=email || user.email
        user.name=name || user.name
        user.isBlocked=isBlocked!==undefined?isBlocked:user.isBlocked

        const updatedUser= await user.save()

        res.status(200).json({email:updatedUser.email,
            name:updatedUser.name,
            isBlocked:updatedUser.isBlocked,
            _id:updatedUser._id,
            profile:updatedUser.profile,
            createdAt:updatedUser.createdAt
        })
    }else{
        res.status(404)
        throw new Error('user not found')
    }
})


// @desc    Add a new user
// route    POST /api/admin/add-user
// @access  Private
const addUser=asyncHandler(async(req, res)=>{
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
      
        res.status(201).json({
            success:true,
            id:user._id,
            name:user.name,
            email:user.email,
            _id:user._id
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    soft delete user
// route    PUT /api/admin/delete-user
// @access  Private
const deleteUser = asyncHandler( async(req, res)=>{
    console.log('bla');
    const {id}=req.body
    const userExist= await User.findById(id)
    if(userExist){
        userExist.isDeleted=true
        console.log(userExist);
        await userExist.save()
        res.status(200).json({success:true})

    }else{
        res.status(400)
        throw new Error('Inavlid user')
    }

})


export {
    userList,
    updateUser,
    addUser,
    deleteUser
}
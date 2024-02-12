import express from 'express'

import { protectAdmin } from '../middleware/authMiddleware.js'
import { 
    userList,
    updateUser,
    addUser,
    deleteUser
 } from '../controllers/adminControllers.js'

const router =express.Router()


router.get('/users-list',protectAdmin,userList)
router.put('/update-user',protectAdmin,updateUser)
router.post('/add-user',protectAdmin,addUser)
router.put('/delete-user',protectAdmin,deleteUser)

export default router 

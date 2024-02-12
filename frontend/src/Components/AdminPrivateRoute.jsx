import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

function AdminPrivateRoute() {
    const {userInfo} = useSelector(state=>state.auth)
    
  return (
    userInfo.isAdmin?<Outlet />:<Navigate to='/' />
  )
}

export default AdminPrivateRoute

import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

function PrivateRoute() {
    const {userInfo} =useSelector((state)=>state.auth)
  return (
    userInfo && !userInfo.isBlocked?<Outlet />:<Navigate to='/'></Navigate>
  )
}

export default PrivateRoute



import React, { useEffect } from 'react'
import { ComplexNavbar } from '../Components/NavBar'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

function HomeScreen() {

  const navigate = useNavigate()
  const {userInfo} = useSelector((state)=>state.auth)
  useEffect(()=>{
    if(!userInfo || userInfo?.isBlocked){
      toast('unautherised')
        navigate('/')
        return
    }
},[navigate, userInfo])
  return (
    <ComplexNavbar />
  )
}

export default HomeScreen

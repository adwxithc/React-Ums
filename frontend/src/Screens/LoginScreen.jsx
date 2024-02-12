import React, { useEffect, useState } from 'react'
import FormContainer from '../Components/FormContainer'
import { 
    Typography,
    Input,
    Button,
   
 } from '@material-tailwind/react'
 import { Spinner } from "@material-tailwind/react";

 import { useLoginMutation } from '../Slices/userApiSlice'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {toast} from 'react-toastify'
import { setCridentials } from '../Slices/authSlice'
function LoginScreen() {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const [email,setEmail]=useState('')
    const [password,setPasword]=useState('')
    const [errors,setErrors]=useState({})

    
    const navigate=useNavigate()
    const {userInfo} =useSelector((state)=>state.auth)
    const dispatch =useDispatch()

    const [login, {isLoading}] = useLoginMutation()

    const handleInput=(e)=>{
        
        const {name, value} = e.target
        setErrors((prevErrors)=>({...prevErrors,[name]:''}))

        if(name=='email'){
            
            setEmail(value)
            if(!emailRegex.test(value)){
            setErrors((prevErrors)=>({...prevErrors,[name]:'*invalid email format'}))
            }
        }else if(name =='password'){
            setPasword(value)
            const passwordErrors = [];
            if (value.length < 8) {
            passwordErrors.push('*password must be at least 8 characters long');
            }
            if (!/\d/.test(value)) {
            passwordErrors.push('*password must contain at least one digit');
            }
            if (!/[a-z]/.test(value) && !/[A-Z]/.test(value)) {
            passwordErrors.push('*password must contain at least one letter');
            }
            if (passwordErrors.length > 0) {
            setErrors((prevErrors) => ({ ...prevErrors, password: passwordErrors.join('\n') }));
            }
        }
        // setErrors({})
        
    }

    const handleSubmit =async(e)=>{
        
        e.preventDefault()
       for(const errorKey in errors){
        if(errors[errorKey]){
        
            return
        }
       }
        
        try {
            const res= await login({
                email,
                password
            }).unwrap()
            dispatch(setCridentials({...res}))
            
            if(res.isAdmin){
                navigate('/adminDashboard')
            }else{
                navigate('/home')
            }
            
            
        } catch (err) {
            
            toast.error(err?.data?.message || err?.error)
        }
    }

    useEffect(()=>{
        if(userInfo && !userInfo.isAdmin &&!userInfo.isBlocked){
            navigate('/home')
        }
    },[navigate, userInfo])
  return (
    <FormContainer>
    <Typography  variant="h3" color="blue-gray">
        Login
    </Typography>


    <form className='p-2' onSubmit={handleSubmit}>
        <div className='w-full md:max-w-[70%] my-4 mx-auto'>
            <Input 
            className=''
            value={email}
            onChange={handleInput}
             label='email'
             size="lg"
             placeholder="example@example.example"
             name='email'
             error={errors.email?true:false}
            
              />
        {errors.email?(
        <Typography
        variant="small"
        color="red"
        className="mt-2 flex items-center  gap-1 font-normal"
      >
   
        {errors.email}
      </Typography>
        ):''}
        </div>
        <div className='w-full md:max-w-[70%] my-4 mx-auto '>
            <Input
            className=''
            value={password}
            onChange={handleInput}
            label='password' 
            type="password" 
            size="lg"
              placeholder="********"
              name='password'
              error={errors.password?true:false}
             
              />
        {errors.password?(
        <Typography
        variant="small"
        color="red"
        className="mt-2 flex  gap-1 font-normal"
      >
        
     
        {errors.password}
      </Typography>
        ):''}
        </div>
 

        <Button className='w-full md:max-w-[70%] mt-6 ' type='submit' >
            {isLoading?<Spinner className='mx-auto' />:<span>Login</span> }
        </Button>
    </form>

    <Typography color="gray" className="my-4 text-center font-normal">
        Create an account?
        <NavLink to='/signup'><a className="font-medium text-gray-900" > Signup</a></NavLink>
    </Typography>

    </FormContainer>
      
  )
}

export default LoginScreen

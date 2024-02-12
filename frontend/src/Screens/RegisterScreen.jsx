import React, { useEffect, useState } from 'react'
import FormContainer from '../Components/FormContainer'
import { 
    Typography,
    Input,
    Button
 } from '@material-tailwind/react'
 import { NavLink, useNavigate } from 'react-router-dom'
import { Spinner } from "@material-tailwind/react";
import {toast} from 'react-toastify'
import { useRegisterMutation } from '../Slices/userApiSlice'

import { useSelector, useDispatch } from 'react-redux'
import { setCridentials } from '../Slices/authSlice'


function RegisterScreen() {

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const [email,setEmail]=useState('')
    const [password,setPasword]=useState('')
    const [rePassword,setRepasword]=useState('')
    const [name,setName]=useState('')
    const [errors,setErrors]=useState({})

    
    const navigate=useNavigate()
    const {userInfo} =useSelector((state)=>state.auth)
    const dispatch =useDispatch()

    const [register, {isLoading}] = useRegisterMutation()

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
        }else if(name=='rePassword'){
            setRepasword(value)
            if(value!==password)
            setErrors((prevErrors)=>({...prevErrors,[name]:'*both password should be same'}))
        }else if(name=='name'){
            setName(value)
            if(value.trim()==''){
                setErrors((prevError)=>({...prevError,name:"*name can't be null"}))
            }
        }
        
    }

    const handleSubmit =async(e)=>{
        
        e.preventDefault()
        
        for(const errorKey in errors){
            if(errors[errorKey]){
                return
            }
        }
        
        try {
            const res = await register({
                name,
                email,
                password
            }).unwrap()
            
            dispatch(setCridentials({...res}))
            navigate('/home')
            
        } catch (err) {
            
            toast.error(err?.data?.message || err?.error)
        }
    }

    useEffect(()=>{
        if(userInfo){
            navigate('/home')
        }
    },[navigate, userInfo])

  return (
    <FormContainer>
    <Typography  
    variant="h3" 
    color="blue-gray">
        Signup
    </Typography>

    <form className='p-2' onSubmit={handleSubmit}>
    <div className='max-w-[70%] my-4 mx-auto'>
            <Input 
            onChange={handleInput}
             label='Your name'
             size="lg"
             placeholder="name"
             name='name'
             error={errors.name?true:false}

              />
            {errors.name?(
            <Typography
            variant="small"
            color="red"
            className="mt-2 flex items-center  gap-1 font-normal"
            >

            {errors.name}
            </Typography>
            ):''}
             
        </div>

        <div className='max-w-[70%] my-4 mx-auto'>
            <Input
            onChange={handleInput}
            type='email'
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
        <div className='max-w-[70%] my-4 mx-auto'>
            <Input   
            onChange={handleInput}
            label='password ' 
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
            className="mt-2 flex items-center  gap-1 font-normal"
        >
    
            {errors.password}
        </Typography>
            ):''}
              
        </div>

        <div className='max-w-[70%] my-4 mx-auto'>
            <Input   
            onChange={handleInput}
            label='re-enter password ' 
            type="password" 
            size="lg"
              placeholder="********" 
              name='rePassword'
             error={errors.rePassword?true:false}

              />
            {errors.rePassword?(
            <Typography
            variant="small"
            color="red"
            className="mt-2 flex items-center  gap-1 font-normal"
            >
    
            {errors.rePassword}
        </Typography>
            ):''}
        </div>
 

        <Button className='w-full max-w-[70%] mt-6' type='submit' >
            {isLoading? <Spinner className='mx-auto' /> : <span>Signup</span> }
        </Button>
    </form>

    <Typography color="gray" className="my-4 text-center font-normal">
    already have  an account?
        <NavLink to='/'><a href="#" className="font-medium text-gray-900" > Login</a></NavLink>
    </Typography>

    </FormContainer>
      
  )
}

export default RegisterScreen

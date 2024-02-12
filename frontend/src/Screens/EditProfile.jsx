import { Input, Navbar, Spinner, Typography } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import { ComplexNavbar } from '../Components/NavBar'
import Tabs from '../Components/Tabs'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateUserMutation } from '../Slices/userApiSlice';
import { setCridentials } from '../Slices/authSlice';
import { useNavigate } from 'react-router-dom';


function EditProfile() {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const [email,setEmail]=useState('')
    const [rePassword,setRepasword]=useState('')
    const [password,setPasword]=useState('')
    const [name,setName]=useState('')
    const [errors,setErrors]=useState({})

    const {userInfo} =useSelector((state)=>state.auth)
    const dispatch=useDispatch()
    const [update, {isLoading}]=useUpdateUserMutation()
    const navigate=useNavigate()

    useEffect(()=>{
        if(userInfo.isBlocked){
            navigate('/')
            return
        }
        setEmail(userInfo.email)
        setName(userInfo.name)

    },[userInfo.name,userInfo.email])

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

    const handleInfoUpdate =async(e)=>{
        
        e.preventDefault()
       
        for(const errorKey in errors){
            if(errors[errorKey]){
                return
            }
        }
        
        try {

            const res= await update({
                email,name
            }).unwrap()
            dispatch(setCridentials({...res}))
            toast.success('profile updated')
            
       
            
        } catch (err) {
            
            toast.error(err?.data?.message || err?.error)
        }
    }

    const handlePasswordUpdate =async(e)=>{
        
        e.preventDefault()
       
        for(const errorKey in errors){
            if(errors[errorKey]){
                return
            }
        }
        
        try {

            const res= await update({
                password
            }).unwrap()
            dispatch(setCridentials({...res}))
            toast.success('profile updated')
            
       
            
        } catch (err) {
            
            toast.error(err?.data?.message || err?.error)
        }
    }
    const data = [
        {
          label: "Info",
          value: "info",
          body:  (<form className='p-8 border-2 rounded' onSubmit={handleInfoUpdate}>
                      <div className='my-5 '>
                         
                          <div>
                              <Input
                              onChange={handleInput}
                              value={name}
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
                      </div>
                      <div className='my-5'>
                         
                          <div>
                              <Input
                              onChange={handleInput}
                              value={email}
                                  label='email'
                                  size="lg"
                                  placeholder="email"
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
                      </div>
                      <div className='flex justify-center'>
                      <button type='submit' className='mt-5 border-2 border-black hover:bg-black hover:text-white px-6 py-2 rounded-full '>
                        {isLoading?<Spinner color='indigo' />:<span>Update</span>}
                        
                    </button>
                      </div>
                      
                  
                  </form> ),
        },
        {
          label: "Password",
          value: "password",
          body: (<form className='p-8 border-2 rounded' onSubmit={handlePasswordUpdate}>
          <div className='my-5 '>
              
              <div >
                  <Input
                  onChange={handleInput}
                  value={password}
                  type='password'
                      label='new password'
                      size="lg"
                      placeholder="password"
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
          </div>
          <div className='my-5 '>
              
              <div >
                  <Input
                  onChange={handleInput}
                
                  type='password'
                      label='re enter password'
                      size="lg"
                      placeholder="*******"
                      name='rePassword'
                      error={errors.rePassword?true:false}
                      value={rePassword}
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
          </div>
            <div className='flex justify-center'>
                <button type='submit' className='mt-5 border-2 border-black hover:bg-black hover:text-white px-6 py-2 rounded-full '>
                {isLoading?<Spinner color='indigo' />:<span>Update</span>}
                </button>
            </div>
      </form> ),
        },
    
    
      ];

  return (
    <div className='bg-[#F0F2F5] h-[100vh]'>
    <ComplexNavbar />
    <div className='container mx-auto  m-8'>


    <Tabs data={data}   />

      
    </div>
    </div>

  )
}

export default EditProfile

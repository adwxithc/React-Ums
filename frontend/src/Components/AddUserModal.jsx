import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { toast } from 'react-toastify'
import { useAddUserMutation } from "../Slices/adminApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {setUpdatedUser, toggleLoading } from "../Slices/searchUserSlice";
 
export function AddUserModal(props) {

    const {
        open,
        setOpenAddUser
    } = props

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const [email,setEmail]=useState('')
    const [name, setName]=useState('')

    const [password,setPasword] = useState()
    const [rePassword,setRepasword] = useState()
    const [errors, setErrors] = useState({})
    

    const handleInput=(e)=>{
        
      const {name, value} = e.target
    
      setErrors((prevErrors)=>({...prevErrors,[name]:''}))

      if(name=='email'){
          
          setEmail(value)
          if(!emailRegex.test(value)){
          setErrors((prevErrors)=>({...prevErrors,[name]:'*invalid email format'}))
          }
      }else if(name=='name'){
          setName(value)
          if(value.trim()==''){
              setErrors((prevError)=>({...prevError,name:"*name can't be null"}))
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
      }


  }
  const [addUser] = useAddUserMutation()
  const dispatch = useDispatch()
  const {result, isLoading} = useSelector(state=>state.searchUsers)

  const handleAddUser= async()=>{
        
    for(const errorKey in errors){
        if(errors[errorKey]){
            return
        }
    }
    if(!name || !email || !password || !rePassword) return

    try {
      dispatch(toggleLoading())
        const res = await addUser({
            name,
            email,
            password
        }).unwrap()
        
        dispatch(setUpdatedUser([res,...result]))
        
        toast.success('new user created')
        
    } catch (err) {
        
        toast.error(err?.data?.message || err?.error)
    }

    dispatch(toggleLoading())

    setOpenAddUser(false)
}
 
  return (
    <>
     
      <Dialog
        open={open}
       
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Add  User</DialogHeader>
        <DialogBody>
         
        <form className='p-2' >
    <div className='max-w-[70%] my-4 mx-auto'>
            <Input
            value={name}
             label='Your name'
             size="lg"
             placeholder="name"
             name='name'
            error={errors.name}
            onChange={handleInput}
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
          value={email}
            type='email'
             label='email'
             size="lg"
             placeholder="example@example.example"
             name='email'
             error={errors.email}
             onChange={handleInput}
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
            value={password}
            label='password ' 
            type="password" 
            size="lg"
              placeholder="********" 
              name='password'
              error={errors.password}
              onChange={handleInput}
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
            
            label='re-enter password ' 
            type="password" 
            size="lg"
              placeholder="********" 
              name='rePassword'
              error={errors.rePassword}
              onChange={handleInput}
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
 

    
    </form>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={()=>setOpenAddUser(false)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleAddUser}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
        {isLoading &&
            <div className="absolute h-full w-full top-0 left-0 flex items-center bg-[#0000003e]">
            <Spinner className="h-14 w-14 m-auto"/>
            </div>
        }
      </Dialog>
    </>
  );
}
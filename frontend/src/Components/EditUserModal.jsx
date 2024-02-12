import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Switch,
  Typography,
  Spinner
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { useEditUserMutation } from "../Slices/adminApiSlice";
import { setUpdatedUser, toggleLoading } from "../Slices/searchUserSlice";
import { toast } from "react-toastify";
 
export function EditUserModal(props) {

 const {
  open,
  setOpen,
  id,
  setId
   
    
}=props
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


const {result,isLoading} = useSelector(state=>state.searchUsers)
const [email,setEmail]=useState('')
const [name, setName]=useState('')
const [isBlocked,setIsBlocked] = useState()
const [errors, setErrors] = useState({})

const [update]=useEditUserMutation()
const dispatch = useDispatch()

useEffect(()=>{
  if(!id) return
  const {email, name,isBlocked}= result.find(item=>item._id==id)
  setEmail(email);
  setName(name);
  setIsBlocked(isBlocked);


},[id,open])


const handleUpdate =useCallback( async()=>{

  for(const errorKey in errors){
    if(errors[errorKey]){
        return
    }
}
if(!name || !email) return
try {
  dispatch(toggleLoading())
  const res= await update({
      email,name,isBlocked,id
  }).unwrap()
  const updatedUsers= result.filter(item=>item._id!==res._id)
  dispatch(setUpdatedUser([result,{...updatedUsers}]))

  toast.success('profile updated')
  setOpen(false)
  setId(null)
  
} catch (err) {
  console.log(err);
  toast.error(err?.data?.message || err?.error)
}
finally{
  dispatch(toggleLoading())
}
},[email,name,isBlocked,id])






const handleInput=useCallback((e)=>{
        
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
  }else if(name==='block'){
      
      setIsBlocked(e.target.checked)
  }
  // setErrors({})
  
},[])
  return (
    <>
  
      <Dialog
        open={open}
        className="relative"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Its a simple dialog.</DialogHeader>
        <DialogBody>
        <form className='p-8 border-2 rounded'  >
                        <div className='my-5 '>
                         
                          <div>
                              <Input
                              onChange={handleInput}
                                value={name}
                                  label='Your name'
                                  size="lg"
                                  placeholder="name"
                                  name='name'
                                error={errors.name}
                                  />
                               
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
                                  error={errors.email}
                                  />
                              
                          </div>
                      </div>

                    <div className='my-5'> 
                    <Typography>
                        block
                    </Typography>
                        <div>
                            <Switch
                            
                             defaultChecked={isBlocked}
                              onChange={handleInput}
                               name="block"
                               error={errors.block}
                               />
                        </div>
                    </div>


                      <div className='flex justify-center'>
                      
                      </div>
                      
                  
                  </form> 
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={()=>setOpen(false)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleUpdate}>
        
            <span>Update</span>
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
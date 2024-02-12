import React, { useCallback, useState } from 'react'
import { ComplexNavbar } from '../Components/NavBar'
import { UsersListTable } from '../Components/UsersListTable'
import { EditUserModal } from '../Components/editUserModal'
import { AddUserModal } from '../Components/AddUserModal'



function AdminDashBoardScreen() {

    const [id, setId]=useState(null)
    const [open, setOpen] = useState(false)
    const [openAddUser, setOpenAddUser] = useState(false);

    const handleEditUser=useCallback((id)=>{
        setOpen(true)
        setId(id)
    },[])
 
   

  return (
    <div className='bg-[#F0F2F5]'>
      <ComplexNavbar />
      <div className='container mx-auto my-3'>
      <UsersListTable setOpenAddUser={setOpenAddUser}  handleEditUser={handleEditUser}/>  
      </div>
      <EditUserModal open={open}  setOpen={setOpen} id={id} setId={setId} />
    <AddUserModal  setOpenAddUser={setOpenAddUser} open={openAddUser} />
    </div>
  )
}

export default AdminDashBoardScreen

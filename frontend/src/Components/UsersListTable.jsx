import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { MdDeleteOutline } from "react-icons/md";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Spinner,
  

} from "@material-tailwind/react";
import { BASE_URL } from "../urls/urls";
import { useEffect, useState } from "react";
import { setPage, setSearchKey, setSearchResult, setUpdatedUser, toggleLoading } from "../Slices/searchUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteUserMutation, useGetUsersMutation } from "../Slices/adminApiSlice";

import { toast } from "react-toastify";
 
const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Blocked",
    value: "blocked",
  },
  {
    label: "Active",
    value: "active",
  },
];
 
const TABLE_HEAD = ["User","Email", "Status", "Created at", "",""];
 
 
export function UsersListTable(props) {

    const {
        setOpenAddUser,
        handleEditUser
    } = props

    const [loadUsers]=useGetUsersMutation()
    const [deleteUser] = useDeleteUserMutation()
    const dispatch = useDispatch()
    
    const {page,lastPage,result,searchKey,isLoading} = useSelector(state=>state.searchUsers)
    
    useEffect(()=>{

      const getUsers=async()=>{
        try {
            const res= await loadUsers({page:page,key:searchKey}).unwrap()
            dispatch(setSearchResult({...res}))
            
        } catch (err) {
            toast.error(err?.data?.message || err?.error)
        }
      }
      getUsers()

    },[page,searchKey,isLoading])

    const handleDeleteUser= async(id)=>{
      try {
        toast.success('user deleted')
        
        dispatch(toggleLoading())
        
        const res=await deleteUser({id}).unwrap()
        

        const newResult=result.filter(item=>item._id!==id)
        dispatch(setUpdatedUser(newResult))
        toast.success('user deleted')
        dispatch(toggleLoading())

      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message || err?.error)
      }
        
    }

  return (
    <>
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Members list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all members
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            
            <Button className="flex items-center gap-3" size="sm" onClick={()=>setOpenAddUser(true)}>
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add member
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* <Tabs value="all" className="w-full md:w-max">
            <TabsHeader>
              {TABS.map(({ label, value }) => (
                <Tab key={value} value={value}>
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs> */}
          <div className="w-full md:w-72">
            <Input
            value={searchKey}
            onChange={(e)=>{dispatch(setSearchKey(e.target.value))}}
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={index}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.map(
              ({ name, email, createdAt, profile,isBlocked,_id}, index) => {
              
                const isLast = index === result.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
 
                return (
                  <tr key={_id}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar src={`${BASE_URL}/static/profilePic/${profile || 'placeholder.jpg'}`} alt={name} size="sm" />
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {name}
                          </Typography>
                          {/* <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            {email}
                          </Typography> */}
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {email}
                        </Typography>
                        {/* <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal opacity-70"
                        >
                          {name}
                        </Typography> */}
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={isBlocked ? "blocked" : "active"}
                          color={isBlocked ?  "blue-gray" :"green"}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {createdAt}
                      </Typography>
                    </td>
                    <td className={classes} >
                      <Tooltip content="Edit User" >
                        <IconButton variant="text" onClick={()=>handleEditUser(_id)} >
                          <PencilIcon className="h-4 w-4"  />
                        </IconButton>
                      </Tooltip>
                    </td>
                    <td className={classes} >
                      <Tooltip content="Delete User" >
                        <IconButton variant="text" onClick={()=>handleDeleteUser(_id)} >
                          <MdDeleteOutline className="h-6 w-6"  />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page <span>{page}</span> of <span>{lastPage}</span>
        </Typography>
        <div className="flex gap-2">
          <Button disabled={page==1} variant="outlined" size="sm" onClick={()=>dispatch(setPage(Number(page)-1))}>
            Previous
          </Button>
          <Button disabled={page==lastPage} variant="outlined" size="sm" onClick={()=>dispatch(setPage(1+Number(page)))}>
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
    {isLoading &&
            <div className="absolute h-full w-full top-0 left-0 flex items-center bg-[#0000003e]">
            <Spinner className="h-14 w-14 m-auto"/>
            </div>
        }

        
    </>
  );
}
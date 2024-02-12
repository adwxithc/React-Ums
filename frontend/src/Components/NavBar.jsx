import React from "react";
import {
  Navbar,
 
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Card,
  IconButton,
} from "@material-tailwind/react";
import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  RocketLaunchIcon,
  Bars2Icon,
} from "@heroicons/react/24/solid";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../Slices/userApiSlice";
import {toast} from 'react-toastify'
import { clearCridentials } from "../Slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../urls/urls";

 
// profile menu component
const profileMenuItems = [
  {
    label: "My Profile",
    target:'profile',
    icon: UserCircleIcon,
  },
  {
    label: "Edit Profile",
    target:'edit_profile',
    icon: Cog6ToothIcon,
  },
  {
    label: "Sign Out",
    
    icon: PowerIcon,
  },
];
 
function ProfileMenu() {
  const [logout] =useLogoutMutation()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const dispatch =useDispatch()
  const navigate = useNavigate()

  const {userInfo} =useSelector(state=>state.auth)
 
  const closeMenu = () => setIsMenuOpen(false);
  const handleLogout = async(e) => {
    e.preventDefault()
    try {
      await logout().unwrap()
      dispatch(clearCridentials())
      navigate('/')
    } catch (err) {
      toast.error(err.data.message || err.error)
    }
    
  }
 
  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-gray-900 p-0.5"
            src={`${BASE_URL}/static/profilePic/${userInfo.profile || 'placeholder.jpg' }`}
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon, target }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          const onClickHandler=label==='Sign Out'?handleLogout:closeMenu
          return (
            <NavLink
                to={`/${target}`}
            >
            <MenuItem
                
              key={label}
              
              onClick={onClickHandler}

              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >

              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
            </NavLink>
          );
        })}
      </MenuList>
    </Menu>
  );
}
 
 

 

 
// function NavList() {
//   return (
//     <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
    
//       {navListItems.map(({ label, icon }, key) => (
//         <Typography
//           key={label}
//           as="a"
//           href="#"
//           variant="small"
//           color="gray"
//           className="font-medium text-blue-gray-500"
//         >
//           <MenuItem className="flex items-center gap-2 lg:rounded-full">
//             {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
//             <span className="text-gray-900"> {label}</span>
//           </MenuItem>
//         </Typography>
//       ))}
//     </ul>
//   );
// }
 
export function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const {userInfo} =useSelector(state=>state.auth)
 
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
 
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false),
    );
  }, []);
 
  return (
    <Navbar className="mx-auto max-w-screen-3xl p-5 lg:pl-6 rounded-none ">
      <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
        {/* brand */}
        <Typography
          as="a"
          href="#"
          className="mr-4 ml-2 cursor-pointer py-1.5 font-medium"
        >
          Connect
        </Typography>

        {/* <div className="hidden lg:block">
          <NavList />
        </div> */}
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
 
        {userInfo.isAdmin?
        (
          <NavLink to='/adminDashboard'>
          <Button size="sm" variant="text">
            <span>Dashboard</span>
          </Button>
          </NavLink>)
        :(
        <NavLink to='/'>
        <Button size="sm" variant="text">
          <span>Log In</span>
        </Button>
        </NavLink>)}
        <ProfileMenu />

      </div>
     
    </Navbar>
  );
}
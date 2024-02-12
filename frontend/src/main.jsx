import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter,createRoutesFromElements,Route, RouterProvider } from 'react-router-dom'
import HomeScreen from './Screens/HomeScreen.jsx'
import LoginScreen from './Screens/LoginScreen.jsx'
import RegisterScreen from './Screens/RegisterScreen.jsx'
import ProfileScreen from './Screens/ProfileScreen.jsx'
import { Provider } from 'react-redux'
import store from './app/storage.jsx'
import PrivateRoute from './Components/PrivateRoute.jsx'
import EditProfile from './Screens/EditProfile.jsx'
import AdminPrivateRoute from './Components/AdminPrivateRoute.jsx'
import AdminDashBoardScreen from './Screens/AdminDashBoardScreen.jsx'


const route=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} >
      <Route index={true} path='/' element={<LoginScreen />} />
      <Route  path='/signup' element={<RegisterScreen />} />
      

      {/* private route */}
      <Route path='' element={<PrivateRoute />}>
        <Route  path='/home' element={<HomeScreen />} />
        <Route  path='/profile' element={<ProfileScreen />} />
        <Route  path='/edit_profile' element={<EditProfile />} />
      </Route>
      <Route path='' element={<AdminPrivateRoute />}>
        <Route  path='/adminDashboard' element={<AdminDashBoardScreen />} />

      </Route>
       


    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <React.StrictMode>
    <RouterProvider router={route}></RouterProvider>
  </React.StrictMode>
  </Provider>
)

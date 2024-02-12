import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../Slices/authSlice'
import { apiSlice } from "../Slices/apiSlice";
import searchUserReducer from "../Slices/searchUserSlice";

const store =configureStore({
    reducer:{
        auth:authReducer,
        searchUsers:searchUserReducer,
        [apiSlice.reducerPath]:apiSlice.reducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(apiSlice.middleware),
    devTools:true
})

export default store
import { createSlice } from "@reduxjs/toolkit";

const initialState={
    result:[],
    searchKey:'',
    page:1,
    lastPage:undefined,
    isLoading:false
}

const searchUsersSlice=createSlice({
    name:'searchUsers',
    initialState,
    reducers:{
        setSearchKey:(state,action)=>{
            state.searchKey=action.payload
            state.page==1
        },
        setPage:(state,action)=>{
            state.page=action.payload
        },
        setSearchResult:(state,action)=>{
            state.lastPage=action.payload.lastPage,
            state.page=action.payload.page
            state.result=action.payload.users
        },
        setUpdatedUser:(state,action)=>{
            state.result=action.payload
        },
        toggleLoading:(state,action)=>{
            state.isLoading=!state.isLoading
        }
    }
})

export const {setSearchKey, setPage, setSearchResult, setUpdatedUser, toggleLoading} = searchUsersSlice.actions
export default  searchUsersSlice.reducer
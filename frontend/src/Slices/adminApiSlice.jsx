import { apiSlice } from "./apiSlice";

const ADMIN_URL='/api/admin'

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getUsers:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/users-list?page=${data.page}&key=${data.key}`,
                method:'GET'
            })
        }),
        editUser:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/update-user`,
                body:data,
                method:'PUT'
            })
        }),
        addUser:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/add-user`,
                body:data,
                method:'POST'
            })
        }),
        deleteUser:builder.mutation({
            query:(data)=>({
                url:`${ADMIN_URL}/delete-user`,
                body:data,
                method:'PUT'
            })
        })

    })
}) 



export const {useGetUsersMutation, useEditUserMutation, useAddUserMutation, useDeleteUserMutation} =adminApiSlice

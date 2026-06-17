import { createContext } from "react";

export const AuthContext = createContext({
    accessToken:"",
    setAccessToken:()=>{},
    userData:{},
    setUserData:()=>{},
    loading:true,
    setLoading:()=>{}
})
import axios from 'axios';
import React from 'react'
import { useContext,createContext,useState,useEffect } from 'react'


const userContext=createContext(null);

export const UserProvider=({children})=>{


    useEffect(()=>{
        checkUserType();
    },[])

    const [userType ,setUserType]=useState(null);
const [error,setError]=useState(null);
const [isAdmin,setIsAdmin]=useState(null);

    const checkUserType=async()=>{
await axios.get("http://localhost:8080",{withCredentials:true})
.then((res)=>{

setUserType(res.data.userType);
setIsAdmin(res.data.isAdmin);
}).catch((error)=>{

    setError(error)
})

    }


return(

    <userContext.Provider value={{


        userType,
        isAdmin,
        error
    }}>
        {children}
    </userContext.Provider>
)
 
 
 
}

export const useUser = () => useContext(userContext); 
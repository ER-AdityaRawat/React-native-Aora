import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { getAllPosts } from "./appwrite";

const useAppWrite=(fn:any)=>{
    const [data, setdata] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    
    const fetchData=async()=>{
        setIsLoading(true);
        try{
          const res:any=await fn();
          setdata(res);
        }catch(error:any){
          Alert.alert('Error',error.message)
        }finally{
          setIsLoading(false);
        }
    }
    useEffect(()=>{
      fetchData();
    },[])
    const refetch=()=>fetchData();
    return{data,isLoading,refetch}
}
export default useAppWrite;
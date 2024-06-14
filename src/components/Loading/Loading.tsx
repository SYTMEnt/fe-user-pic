
import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
const Loader = () => {
  return (
    
    <div className="h-screen flex justify-center items-center">
     
      <img src="/images/p2wlogo.png" alt="logo" className=" h-24 " /><Skeleton className="h40 p-8 font-semibold">Pred2win</Skeleton> 
    </div>
  )
}

export default Loader

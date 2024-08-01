import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {supraToast} from '../../Components/toast/SupraToast';

export const NoPage = () => {
  const navigate=useNavigate()
  useEffect(() => {
    supraToast({msg:"No page found"})
  }, []);
  return (
    <>
    <div className=' w-full h-screen p-2 flex items-center justify-center'>
    <div className=' bg-white rounded p-2 absolute right-3 top-6 cursor-pointer' onClick={()=>{navigate("/")}}>Go Back <i className="ri-home-2-fill"></i></div>
    <div className=' text-[#807979] text-2xl md:text-5xl'>*No Page Found*</div>
    </div>
    </>
  )
}

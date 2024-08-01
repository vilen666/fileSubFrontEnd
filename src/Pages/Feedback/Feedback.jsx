import React from 'react'
import axios from 'axios';
import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { supraToast } from '../../Components/toast/SupraToast';
export const Feedback = () => {
  const user=useSelector((state)=>state.user.value);
  const files=useSelector((state)=>state.files.value);
  const [count, setcount] = useState(30);
  const navigate=useNavigate();
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
  useEffect(() => {
    // Start the interval
    let cookie=getCookie("token")
    if(!cookie){
      navigate("/")
    }

    supraToast({ success: true, msg: JSON.stringify(files) })
    let b = setInterval(() => {
      setcount(prev => prev - 1);
    }, 1000);
    // Cleanup function to clear the interval
    return () => clearInterval(b);
  }, []);
  useEffect(() => {
    async function logout(){
      let response=await axios.get("http://localhost:5000/user/logout",{
        withCredentials:true
      })
      if(response.data.success){
        return true
      }
      else{
        return false
      }
    }
    if(count===0)
    {
      if(logout())
      {
        supraToast({success:true,msg:"You were successfully logged out"})
        navigate("/")

      }
    }
  }, [count]);
  return (
    <div className=' w-full h-screen p-4 flex items-center justify-center'>
        <div className='w-[90%] p-3 h-3/4 rounded flex flex-col items-center bg-white relative'>
        <div className='text-xl capitalize'>thanks for responding</div>
        <hr className='border-1 w-full border-black mb-8' />
        <p className=''>{user.name} , your response has succesfully been recorded and an email has been sent to your email id - {user.email}. <br/> Your response are as follows :-</p>
        <ul className="list-disc">
          {!files[0]&&<li>No Files Updated</li>}
          {
            files.map((file,key)=>{
              return(
                <li key={key}>{file}</li>
              )
            })
          }
        </ul>
        <p className="absolute bottom-5 right-5 capitalize">-By supratim lala</p>
        <p className=' absolute bottom-14 md:bottom-5 right-1/2 transform translate-x-1/2 shadow text-nowrap'>You will be logged out in {count}s....</p>
        </div>
    </div>
  )
}

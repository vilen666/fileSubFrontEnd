import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { FloatInput } from '../../Components/FloatingInput/FloatInput'
import { useLoading } from '../../main';
// const backUrl="https://filesubbackend.onrender.com"
const backUrl="http://localhost:5000"
export const AdminRegister = () => {
    const navigate=useNavigate()
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const { setLoading } = useLoading()
    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        let response=await axios.post(`https://filesubbackend.onrender.com/register`,{username,password},{
            withCredentials:true
        })
        console.log(response);
        setLoading(false)
        navigate("/admin")
    }
  return (
    <>
    <div className=' h-screen w-full flex items-center justify-center'>
        <div className=' w-[90%] h-[50%] md:w-[400px] md:h-fit flex items-center pt-14 p-4 flex-col rounded-md bg-zinc-300 shadow-inner shadow-zinc-600' >
            <div className='text-3xl underline '>Register</div>
            <form className='w-full h-fit text-2xl flex items-center flex-col  ' onSubmit={handleSubmit}>
                <FloatInput className='w-full shadow-xl' label='Enter username' value={username} setvalue={setusername}/>
                <FloatInput className='w-full shadow-xl' label='Enter password' value={password} setvalue={setpassword}/>
                <input type="submit" value="Register" className=' px-5 py-3 mt-14 bg-black rounded-md text-white shadow-xl cursor-pointer' />
            </form>
        </div>

    </div>
    </>
  )
}

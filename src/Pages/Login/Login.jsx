import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FloatInput } from '../../Components/FloatingInput/FloatInput'
import axios from 'axios'
import { supraToast } from '../../Components/toast/SupraToast';
import { useLoading } from '../../main';
export const Login = () => {
    const [roll, setroll] = useState("");
    const [phone, setphone] = useState("");
    const navigate = useNavigate()
    const {setLoading}=useLoading()
    useEffect(() => {
        supraToast({ success: true, msg: "Welcome By Supratim Lala" })
    }, []);
    async function handleSubmit(e) {
        e.preventDefault()
        try {
            setLoading(prev=>!prev)
            let response = await axios.post(`https://filesubbackend.onrender.com/user`, { roll, phone }, {
                withCredentials: true
            })
            setLoading(prev=>!prev)
            if (response.data.success) {
                supraToast({ success: true, msg: "You are successfully Logged in" })
                navigate("/upload")
            }
            else {
                throw new Error(response.data.data)
            }
        } catch (error) {
            supraToast({success:false,msg:error.message})
            
        }
    }
    return (
        <>
            <div className=' h-screen w-full flex items-center justify-center'>
                <div className=' w-[90%] h-[50%] md:w-[400px] md:h-fit flex items-center pt-14 p-4 flex-col rounded-md bg-zinc-300 shadow-inner shadow-zinc-600' >
                    <div className='text-3xl underline '>Please Log in</div>
                    <form className='w-full h-fit text-2xl flex items-center flex-col  ' onSubmit={handleSubmit}>
                        <FloatInput className='w-full shadow-xl' label='Enter Roll No.' value={roll} setvalue={setroll} />
                        <FloatInput className='w-full shadow-xl' label='Enter phone No..' value={phone} setvalue={setphone} />
                        <input type="submit" value="Log in" className=' px-5 py-3 mt-14 bg-black rounded-md text-white shadow-xl cursor-pointer' />
                    </form>
                </div>

            </div>
        </>
    )
}

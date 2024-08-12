import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { supraToast } from '../../Components/toast/SupraToast';
import { useLoading } from '../../main';
const backUrl="https://filesubbackend.onrender.com"
// const backUrl = "http://localhost:5000"
export const Feedback = () => {
  const files = useSelector((state) => state.files.value);
  const [count, setcount] = useState(30);
  const [user, setuser] = useState({ name: "xxxx", email: "XXXX" });
  let { setLoading } = useLoading();
  const navigate = useNavigate();
  useEffect(() => {
    // Start the interval
    const fetchUser = async () => {
      try {
        setLoading(true)
        let response = await axios.get(backUrl + `/user/fetchUser`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        setLoading(false)
        if (!response.data.success) {
          throw new Error(response.data.data)
        }
        else {
          setuser(response.data.data)
        }
      } catch (error) {
        console.log(error.message)
        navigate("/")
      }

    }
    fetchUser()
    supraToast({ success: true, msg: JSON.stringify(files) })
    let b = setInterval(() => {
      setcount(prev => prev - 1);
    }, 1000);
    // Cleanup function to clear the interval
    return () => clearInterval(b);
  }, []);
  useEffect(() => {
    async function logout() {
      // let response = await axios.get(backUrl+"/user/logout", {
      //   withCredentials: true
      // })
      // if (response.data.success) {
      //   return true
      // }
      // else {
      //   return false
      // }
      localStorage.removeItem("token")
      return true
    }
    const mailUser = async () => {
      try {
        console.log(user.email, files)
        setLoading(true)
        let txt = ""
        if (files[0]) {
          txt = JSON.stringify(files)

        }
        else {
          txt = "None updated"
        }
        let response = await axios.post(backUrl+`/user/mail`, { text: txt, email: user.email }, {
          headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        setLoading(false)
        if (!response.data.success) {
          throw new Error(response.data.data)
        }
        else {
          supraToast({ success: true, msg: response.data.data })
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if (count === 28) {
      mailUser()
    }
    if (count === 0) {
      if (logout()) {
        supraToast({ success: true, msg: "You were successfully logged out" })
        navigate("/")
      }
    }
  }, [count]);
  return (
    <div className=' w-full h-screen p-4 flex items-center justify-center'>
      <div className='w-[90%] p-3 h-3/4 rounded flex flex-col items-center bg-white relative'>
        <div className='text-xl capitalize'>thanks for responding</div>
        <hr className='border-1 w-full border-black mb-8' />
        <p className=''>{user.name} , your response has succesfully been recorded and an email has been sent to your email id - {user.email}. <br /> Your response are as follows :-</p>
        <ul className="list-disc">
          {!files[0] && <li>No Files Updated</li>}
          {
            files.map((file, key) => {
              return (
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

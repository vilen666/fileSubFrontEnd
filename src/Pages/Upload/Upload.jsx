import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { setuser } from "../../store/userSlice";
import { setfile } from '../../store/fileSlice';
import axios from 'axios';
import { supraToast } from '../../Components/toast/SupraToast';
export const Upload = () => {
    const dispatch = useDispatch();
    const [user, setUser] = useState({});
    const [subs, setsubs] = useState([]);
    const [oldFiles, setoldFiles] = useState([]);
    const [newFiles, setnewFiles] = useState([]);
    const [fileName, setFilename] = useState([])
    const [files, setFiles] = useState([]);
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        async function uploadFiles() {

            try {
                const formData = new FormData();
                formData.append('userRoll', user.roll);
                formData.append("newFiles", JSON.stringify(newFiles))
                formData.append("oldFiles", JSON.stringify(oldFiles))
                files.forEach(file => {
                    formData.append('pdfs', file.file, file.fileName);
                })
                let response = await axios.post(`https://filesubbackend.onrender.com/upload`, formData, {
                    withCredentials: true
                })
                if (response.data.success) {
                    dispatch(setfile(response.data.list))
                    navigate("/feedback")
                }
                else {
                    throw new Error(response.data.data)
                }
            } catch (error) {
                supraToast({ msg: error.message })
                // window.location.reload()
            }
        }
        uploadFiles()
    }
    useEffect(() => {
        const fetchUser = async () => {
            try {
                let response = await axios.get(`https://filesubbackend.onrender.com/user/fetchUser`, {
                    withCredentials: true
                })
                if (response.data.success) {
                    let temp = response.data.data
                    setUser(temp)
                    dispatch(setuser({ name: temp.name, email: temp.email }))
                }
                else {
                    throw new Error(response.data.data)
                }
            } catch (error) {
                console.log(error.message)
                navigate("/")
            }

        }
        const fetchSubs = async () => {
            try {
                let response = await axios.get(`https://filesubbackend.onrender.com/fetchSubs`, {
                    withCredentials: true
                })
                if (!response.data.success) {
                    // console.log(response.data)
                }
                else {
                    setsubs(response.data.data)
                }
            } catch (error) {
                console.log(error.message)
                navigate("/")
            }

        }
        const fetchUserPdfs = async () => {
            try {
                let response = await axios.get(`https://filesubbackend.onrender.com/user/fetchUserPdfs`, {
                    withCredentials: true
                })
                // console.log(response.data)
                if (response.data.success) {
                    setoldFiles(response.data.data)
                    setFilename(response.data.data)
                }
                else {
                    throw new Error(response.data.data)
                }
            } catch (error) {
                // console.log(error.message)
            }
        }
        fetchUser()
        fetchSubs()
        fetchUserPdfs()
    }, []);
    return (
        <>
            <div className=" h-screen w-full p-5">
                <div className='text-xl capitalize text-blue-600'>welcome {user.name}</div>
                <hr className=' border-1 border-white' />
                <form onSubmit={handleSubmit} className=' w-[90%] h-fit rounded p-3 mt-6 bg-zinc-300 mx-auto flex flex-col' >
                    <label> Subject Lists: </label>
                    <hr className=' border-1 border-black mb-5' />
                    {
                        subs[0] && (subs.map((subject, key) => {
                            return (
                                <div key={key}>
                                    <FileSelect subject={subject.subid} files={files} setfiles={setFiles} newFiles={newFiles} setnewFiles={setnewFiles} user={user} oldFiles={oldFiles} setoldFiles={setoldFiles} fileName={fileName} setFilename={setFilename} />
                                </div>
                            )
                        }))
                    }
                    <input type="submit" value="Submit" className=' bg-black w-fit p-3  text-white rounded mx-auto my- cursor-pointer' />
                </form>
            </div>
        </>
    )
}
const FileSelect = ({ subject, files, setfiles, fileName, setFilename, oldFiles, setoldFiles, newFiles, setnewFiles, user }) => {
    const [msg, setmsg] = useState({ found: false, msg: "No file selected" });
    const fileInput = useRef(null);
    let fileNameTxt = `${user.roll}-${subject}.pdf`
    const handleChange = (e) => {
        let tempFile = e.target.files[0]
        if (tempFile && tempFile.size > 1048576) { // 1 MB = 1048576 bytes
            setmsg({ found: false, msg: 'File size must be less than 1 MB' });
            e.target.value = ''; // Clear the input
        }
        else {
            let item = { subcode: subject, filename: tempFile.name }
            setoldFiles(prev => (prev.filter(file => file.subcode !== subject)))
            setFilename(prev => {
                return (
                    prev.some((file) => file.subcode === subject) ?
                        prev.map((file) => file.subcode === subject ? item : file) :
                        [...prev, item]
                )
            })
            setnewFiles(prev => {
                return (
                    prev.some((file) => file.subcode === subject) ?
                        prev.map((file) => file.subcode === subject ? { subcode: subject, filename: fileNameTxt } : file) :
                        [...prev, { subcode: subject, filename: fileNameTxt }]
                )
            })
            // Update the existing file or add a new one if it doesn't exist
            let newItem = { fileName: fileNameTxt, file: tempFile }
            setfiles((prev) =>
                prev.some((item) => item.subcode === subject)
                    ? prev.map((item) => (item.subcode === subject ? newItem : item))
                    : [...prev, newItem]
            );
        }
    };
    const fileRemove = () => {
        setoldFiles(prev => (prev.filter(file => file.subcode !== subject)))
        setnewFiles(prev => (prev.filter(file => file.subcode !== subject)))
        setfiles(prev => (prev.filter(file => file.fileName.split("-")[1].split(".")[0] !== subject)))
        setFilename(prev => (prev.filter(file => file.subcode !== subject)))
    }
    useEffect(() => {
        // console.log(fileName, oldFiles, newFiles, files)
    }, [fileName, oldFiles, newFiles, files]);
    useEffect(() => {
        if (fileName.some(file => file.subcode === subject)) {
            for (let i = 0; i < fileName.length; i++) {
                if (subject === fileName[i].subcode) {
                    setmsg({ found: true, msg: fileName[i].filename })
                    break
                }
            }
        }
        else {
            setmsg({ found: false, msg: "No file selected" })
        }
    }, [fileName]);
    return (
        <div className=' h-fit my-5 flex flex-col items-start justify-center gap-2 '>
            <div className='flex items-center'>
                <label className='text-xl mr-3 uppercase'>{subject}</label>
                <label className='text-3xl'>
                    <i className="ri-add-circle-fill cursor-pointer"></i>
                    <input ref={fileInput} type="file" required={false} accept="application/pdf" className='hidden' onChange={handleChange} />
                </label>
            </div>
            <div className='flex gap-2 w-1/2 items-center'>
                <label className='filename text-sm'>{msg.msg}</label>
                {msg.found && <i className="ri-close-circle-fill text-3xl text-red-800 cursor-pointer" onClick={fileRemove}></i>}
            </div>
        </div>
    )
}
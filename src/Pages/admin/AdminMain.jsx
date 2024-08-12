import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FloatInput } from '../../Components/FloatingInput/FloatInput';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useLoading } from '../../main';
const backUrl="https://filesubbackend.onrender.com"
// const backUrl="http://localhost:5000"
export const AdminMain = () => {
    const navigate = useNavigate()
    const options = ["add user", "edit user", "edit subjects", "edit file","logOut"]
    const [admin, setadmin] = useState({});
    const [subcodes, setsubcodes] = useState([]);
    const { setLoading } = useLoading()
    const [visible, setvisible] = useState(0);
    const fetchSubs = async () => {
        setLoading(prev => !prev)
        let response = await axios.get(backUrl+`/fetchSubs`, {
            // withCredentials: true
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
        }
        })
        setLoading(prev => !prev)
        setsubcodes(response.data.data || [])
    }
    useEffect(() => {
        const checkLogin = async () => {
            setLoading(prev => !prev)
            let response = await axios.get(backUrl+`/checkLogin`, {
                // withCredentials: true
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
            }
            })
            setLoading(prev => !prev)
            if (!response.data.success) {
                console.log(response.data.data)
                navigate("/admin")
            }
        }
        fetchSubs()
        checkLogin()
    }, []);
    const handleSubUpdate = async () => {
        setLoading(prev => !prev)
        let response = await axios.post(backUrl+`/subUpdate`, { subcodes }, {
            // withCredentials: true
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
        }
        })
        setLoading(prev => !prev)
        fetchSubs()
    }
    return (
        <div className="main h-screen w-full p-4">
            <p className=' text-2xl text-blue-600'>Welcome Admin</p>
            <hr className=' border-1 border-white' />
            <div className='options flex gap-3 mt-5 text-nowrap flex-wrap'>
                {
                    options.map((options, key) => (
                        <div className="option px-3 capitalize text-md bg-white shadow rounded cursor-pointer" key={key} onClick={() => { setvisible(key) }}>{options}</div>
                    ))
                }
            </div>
            <div className=' overflow-x-scroll w-[90%] md:w-[70%]  h-[80%] shadow bg-white mx-auto my-7 rounded p-3'>
                {
                    (visible === 0) && <AddUser setLoading={setLoading} />
                }
                {
                    (visible === 1) && <EditUser setLoading={setLoading} />
                }
                {
                    (visible === 2) && <Subjects setLoading={setLoading} subcodes={subcodes} setsubcodes={setsubcodes} handleSubUpdate={handleSubUpdate} />
                }
                {
                    (visible === 3) && <FileUploads setLoading={setLoading} subcodes={subcodes} />
                }
                {
                    (visible === 4) && <Logout />
                }
            </div>
        </div>
    )
}
function AddUser({ setLoading }) {
    const [name, setname] = useState("");
    const [phone, setphone] = useState("");
    const [roll, setroll] = useState("");
    const [email, setemail] = useState("");
    const [msg, setmsg] = useState("No file Selected");
    const [data, setdata] = useState([]);
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(prev => !prev)
        let response = await axios.post(backUrl+`/addUser`, { name, phone, roll, email }, {
            // withCredentials: true
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
        }
        })
        setLoading(prev => !prev)
        setname("")
        setemail("")
        setphone("")
        setroll("")
    }
    const handleExcelSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        try {
            const promises = data.map(user =>
                axios.post(backUrl+`/addUser`, user, {
                    // withCredentials: true
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                }
                })
            );

            // Await all the upload promises
            const results = await Promise.all(promises);

            // Check if all uploads were successful
            results.forEach(response => {
                if (!response.data.success) {
                    throw new Error(response.data.data);
                }
            });

            console.log('All files uploaded successfully');
        } catch (error) {
            console.error('Error uploading files:', error.message);
        } finally {
            setdata([]); // Clear the data after upload
            setLoading(false); // Stop loading
        }
    };
    function handleExcel(e) {
        const file = e.target.files[0];
        setmsg(file.name)
        const reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target.result;
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const sheetData = XLSX.utils.sheet_to_json(worksheet);
            setdata(sheetData);
        }
        reader.readAsArrayBuffer(file);
    }
    return (
        <>
            <div >Add User</div>
            <hr className=' border-1 border-black' />
            <form className='w-full flex flex-col md:grid md:grid-cols-2 md:gap-4' onSubmit={handleSubmit}>
                <FloatInput className='w-full  ' label='Enter Name' value={name} setvalue={setname} />
                <FloatInput className='w-full ' label='Enter Phone Number' value={phone} setvalue={setphone} />
                <FloatInput className='w-full' label='Enter Email' value={email} setvalue={setemail} />
                <FloatInput className='w-full' label='Enter Roll' value={roll} setvalue={setroll} />
                <div className='flex justify-center col-span-2'>
                    <input type="submit" value="Add" className='text-xl text-white mt-3 px-10 uppercase py-2 bg-black rounded-md cursor-pointer w-fit' />
                </div>
            </form>
            <form className='mt-5 flex flex-col gap-2 p-3 w-full' onSubmit={handleExcelSubmit}>
                <label className='mt-3 text-lg text-white bg-black w-fit p-3 rounded cursor-pointer '>Upload a bunch of users by xlsx <i className="ri-add-circle-line text-white"></i>
                    <input type="file" accept='.xlsx' className='hidden' onChange={handleExcel} />
                </label>
                <label htmlFor="filename">{msg}</label>
                {
                    data[0] && (
                        <ul className='list-decimal w-full p-4'>
                            {data.map((row, key) => {
                                return (
                                    <div key={key} className='flex flex-wrap gap-2'>
                                        <li>{row.name}</li>
                                        <i className="ri-close-circle-fill text-red-600 cursor-pointer" onClick={() => {
                                            setdata(prevItems => {
                                                const newItems = [...prevItems];  // Copy the array
                                                newItems.splice(key, 1);        // Remove the item at the specified index
                                                return newItems;
                                            });
                                        }}></i>
                                    </div>
                                )
                            })}
                        </ul>
                    )
                }
                {data[0] &&
                    <input type="submit" value="Add Users" className=' text-lg text-white bg-black p-3 rounded cursor-pointer' />}
            </form>
        </>
    )
}

function EditUser({ setLoading }) {
    const [users, setusers] = useState([]);
    const [removeUser, setremoveUser] = useState([])
    async function handleEdit() {
        setLoading(true); // Start loading

        try {
            const promises = removeUser.map(user =>
                axios.post(backUrl+`/deleteUser`, user, {
                    // withCredentials: true
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                }
                })
            );

            // Await all delete requests
            const results = await Promise.all(promises);

            // Check the success of each response
            results.forEach(response => {
                if (!response.data.success) {
                    throw new Error(response.data.data);
                }
            });

            console.log('All users deleted successfully');
        } catch (error) {
            console.error('Error deleting users:', error.message);
        } finally {
            setremoveUser([]); // Clear the removeUser array
            setLoading(false); // Stop loading
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(prev => !prev)
            try {
                let response = await axios.get(backUrl+`/fetchUsers`, {
                    // withCredentials: true,
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                }
                })
                if (response.data.success) {
                    setusers(response.data.data || [])
                    console.log(response.data.data)
                }
                else {
                    throw new Error(response.data.data)
                }
            }
            catch (error) {
                console.log(error.message)
            }
            setLoading(prev => !prev)
        }
        fetchUsers()
    }, []);
    return (
        <>
            <div className='text-lg'>Edit Users:</div>
            <hr className=' border-1 border-black' />
            {users[0] &&
                <ol className=' list-decimal p-4'>
                    {
                        users.map((user, key) => {
                            return (
                                <li key={key} className=' flex flex-wrap gap-2 items-center w-fit'>
                                    <div>{user.name}</div>
                                    <i className="ri-close-circle-fill text-red-700 cursor-pointer" onClick={() => {
                                        setusers(prevItems => {
                                            const newItems = [...prevItems];  // Copy the array
                                            newItems.splice(key, 1);        // Remove the item at the specified index
                                            return newItems;
                                        });
                                        setremoveUser(prev => [...prev, user])
                                    }}></i>
                                </li>
                            )
                        })
                    }
                </ol>}
            {removeUser[0] && <div className=' text-lg text-white bg-black text-center rounded py-2 cursor-pointer' onClick={handleEdit}>Update</div>}
        </>
    )
}
function Subjects({ setLoading, subcodes, setsubcodes, handleSubUpdate }) {
    const [subname, setsubname] = useState("");
    function handleSubmit(e) {
        e.preventDefault()
        setsubcodes(prev => [...prev, { subid: subname }])
        setsubname("")
    }
    return (
        <>
            <p>List of Subjects: </p>
            <ul className='mt-3 list-decimal flex flex-col items-center'>
                {
                    !subcodes[0] && <p>No subjects Available</p>
                }
                {subcodes.map((sub, key) => {
                    return (
                        <li key={key} className=' w-fit flex gap-2 items-center'>
                            <p>{sub.subid}</p>
                            <i className="ri-close-circle-fill text-red-600" onClick={() => {
                                setsubcodes(prevItems => {
                                    const newItems = [...prevItems];  // Copy the array
                                    newItems.splice(key, 1);        // Remove the item at the specified index
                                    return newItems;
                                }); console.log(subcodes)
                            }}></i>
                        </li>
                    )
                })}
            </ul>
            <form className=' w-full h-fit p-3 ' onSubmit={handleSubmit}>
                <label>Add subject:</label>
                <hr className=' border-1 border-black' />
                <FloatInput className=' w-full' label='Enter subject code' value={subname} setvalue={setsubname} />
                <input type="submit" value="ADD" className=' text-white bg-black p-3 rounded mt-2 cursor-pointer' />
            </form>
            <div className='text-xl text-white bg-black w-1/2 rounded py-2 mx-auto text-center mt-4 cursor-pointer' onClick={handleSubUpdate}>Update</div>
        </>
    )
}
function FileUploads({ setLoading, subcodes }) {
    const [files, setfiles] = useState([]);
    const [subFile, setsubFile] = useState([]);
    const [subject, setsubject] = useState("");
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                setLoading(prev => !prev)
                let response = await axios.get(backUrl+`/fetchFiles`, {
                    // withCredentials: true
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                }
                })
                setLoading(prev => !prev)
                if (response.data.success) {
                    setfiles(response.data.data || [])
                    // console.log(response.data.data);
                }
                else {
                    throw new Error(response.data.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchFiles()
        if (subcodes[0]) {
            setsubject(subcodes[0].subid)
        }
    }, []);
    useEffect(() => {
        if (subject) {
            setsubFile(files.filter(file => (file.subcode === subject)))
        }
        console.log("file or sub changed", files)
    }, [subject, files]);
    const deleteFile = async (item) => {
        try {
            console.log("delete", item)
            let flag = 0
            for (let i = 0; i < files.length; i++) {
                if (files[i].roll === item.roll && files[i].subcode === item.subcode) {
                    flag = i
                    break
                }
            }
            setLoading(prev => !prev)
            let response = await axios.post(backUrl+`/deleteFile`, item, {
                withCredentials: true
            })
            setLoading(prev => !prev)
            if (response.data.success) {
                setfiles((prev) => { prev.splice(flag, 1); return [...prev] })
            }
            else {
                throw new Error(response.data.data)
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    const downloadZip = async () => {
        try {
                setLoading(prev=>!prev)
                let response = await axios.get(backUrl+`/downloadZip/${subject}`, {
                // withCredentials: true,
                responseType: 'blob', // Important for handling binary data like files
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
            }
            });
            setLoading(prev=>!prev)
            console.log(response.headers)
            if (response.status === 200) {
                // Create a Blob from the response data
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = `${subject}.zip`; // Specify the download filename
                document.body.appendChild(a);
                a.click();
                a.remove(); // Clean up

                // Display success message or handle other actions
                console.log('Files downloaded successfully!');
            } else {
                throw new Error("Could not Download");
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <>
            <div className='flex flex-col gap-2 w-full'>
                <div>Edit Files: </div>
                <hr className=' border-1 border-black mb-3' />
                {subcodes[0] &&
                    (
                        <div className=' flex flex-wrap gap-2 items-center justify-center'>
                            {
                                subcodes.map((sub, key) => (
                                    <div key={key} className=' text-white bg-black rounded px-3 cursor-pointer' onClick={() => { setsubject(sub.subid) }}>{sub.subid}</div>
                                ))
                            }
                        </div>
                    )
                }
                {
                    (subFile[0]) ? (
                        <ul className='flex flex-col items-center list-decimal w-full h-fit p-3'>
                            {
                                subFile.map(function (item, key) {
                                    return (
                                        <li key={key}>
                                            <div className='flex items-center justify-center gap-3'><div>{item.filename}</div><i className="ri-close-circle-fill text-red-600 text-2xl cursor-pointer" onClick={() => { deleteFile({ roll: item.roll, subcode: item.subcode }) }}></i></div>
                                        </li>)
                                })
                            }
                            <div className=' cursor-pointer text-white bg-black text-2xl rounded px-3' onClick={downloadZip}>Download</div>
                        </ul>
                    )
                        :
                        (
                            <div className=' mx-auto mt-10'>No Files Found</div>
                        )
                }
            </div>
        </>
    )
}

const Logout=()=>{
    const navigate=useNavigate()
    useEffect(() => {
        const logout=()=>{
            localStorage.removeItem("token")
            console.log( "You are successfully Logged out")
            navigate("/admin")
        }
        logout()
    }, []);
    return(
        <>
        </>
    )
}

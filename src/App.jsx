import React from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NoPage } from './Pages/Nopage/NoPage';
import { Login } from './Pages/Login/Login';
import { Upload } from './Pages/Upload/Upload';
import { Feedback } from './Pages/Feedback/Feedback';
import { AdminLogin } from './Pages/admin/AdminLogin';
import { AdminMain } from './Pages/admin/AdminMain';
import { AdminRegister } from './Pages/admin/AdminRegister';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="*" element={<NoPage/>} />
      <Route path="/" element={<Login/>} />
      <Route path="/upload" element={<Upload/>} />
      <Route path="/feedback" element={<Feedback/>} />
      <Route path="/admin" element={<AdminLogin/>} />
      <Route path="/admin/register" element={<AdminRegister/>} />
      <Route path="/admin/main" element={<AdminMain/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
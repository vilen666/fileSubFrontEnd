import React from 'react'
import "./floatInput.css"
export const FloatInput = ({className="w-[100px] h-[500px]",label="Default",value,setvalue}) => {
  return (
    <div className={`floating-label-input mt-9 relative ${className}`}>
    <input type="text" id="input1" className='rounded' required={true} value={value} onChange={(e)=>{setvalue(e.target.value)}}  />
    <label htmlFor="input1">{label}</label>
  </div>
  )
}

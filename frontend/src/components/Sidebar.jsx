import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    const [isOpen,setIsOpen] = useState(false);
  return (
    <>
    <button className='text-white bg-gray-800 p-2 rounded-md'
    onClick={()=>setIsOpen(!isOpen)}>
        ☰
    </button>

    <div className={`fixed top-0 left-0 h-full w-50 bg-gray-900 text-white transform
     ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}>
        <button className='absolute top-4 right-4 text-white'
        onClick={()=> setIsOpen(false)}>
            ✖
        </button>
        <nav className='flex flex-col justify-items-end gap-7 relative top-40 px-6'>
            <Link to='/' className='text-lg hover:bg-gray-700 p-2 rounded'>🏠 Home</Link>
            <Link to='/analysis' className='text-lg hover:bg-gray-700 p-2 rounded'>📊 Analysis</Link>
            <Link to='/about' className='text-lg hover:bg-gray-700 p-2 rounded'>ℹ️ About</Link>
        </nav>

    </div>
    </>
  )
}

export default Sidebar;
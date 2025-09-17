import React from 'react'
// Images & logos
import SideImage from '../assets/auth.svg'
import Logo from '../assets/CommitLog-Logo.png'

const AuthLayout = ({ children, title }) => {
  return (
    <div className='h-screen'>
      <div className='lg:grid grid-cols-4 gap-4'>
        {/* sidebar */}
        <div className='hidden lg:block'>
          <div
            className='h-screen bg-cover bg-center border-r-2 border-neon flex flex-col justify-center items-center'
            style={{ backgroundImage: `url(${SideImage})` }}
          >
            <h2 className='text-white text-6xl font-sans font-bold -rotate-90'>{title}</h2>
          </div>
        </div>

        {/* Credential bar */}
        <div className='col-span-3'>
          <img src={Logo} alt="Logo" className='w-2xs m-auto' />
          <h2 className='text-4xl text-white font-sans font-bold m-6'>Welcome</h2>
          <div className='flex flex-col mx-auto w-screen md:w-3/4 max-h-screen'>
            {/* children */}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout

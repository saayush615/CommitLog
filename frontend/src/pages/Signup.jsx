import React from 'react'
// Layout
import AuthLayout from '../components/AuthLayout'
// Icons
import Google from '../assets/google.svg'
import FB from '../assets/fb.svg'

const Signup = () => {
  return (
    <div>
      <AuthLayout title='Sign-up'>
        <div className='flex flex-col w-full'>
          <input type="text" placeholder='Enter your first name' className='border-2 border-neon text-white m-2 p-4 w-3/4 h-10' />
          <input type="text" placeholder='Enter your last name' className='border-2 border-neon text-white m-2 p-4 w-3/4 h-10' />
          <input type="text" placeholder='Enter unique username' className='border-2 border-neon text-white m-2 p-4 w-3/4 h-10' />
          <input type="email" placeholder='Enter your email' className='border-2 border-neon text-white m-2 p-4 w-3/4 h-10' />
          <input type="password" placeholder='Enter your password' className='border-2 border-neon text-white m-2 p-4 w-3/4 h-10' />
          <button type='submit' className='text-black font-sans bg-white p-3 m-2 rounded-xl cursor-pointer w-24 h-10 flex items-center justify-center'>Submit</button>
          <div className=' border-t-2 border-white border-dotted flex flex-col items-center'>
            <p>or</p>
            <div className='bg-white text-black font-sans m-3 p-4 rounded-2xl flex justify-center items-center gap-1 w-3/4 h-14 md:1/2'>
              <img src={Google} alt="Google" className='h-8 md:h-12' />
              <p>Continue with google</p>
            </div>
            <div className='bg-white text-black font-sans m-3 p-4 rounded-2xl flex justify-center items-center gap-1 w-3/4 h-14 md:1/2'>
              <img src={FB} alt="FB" className='h-8 md:h-12' />
              <p>Continue with facebook</p>
            </div>
          </div>
        </div>
      </AuthLayout>
    </div>
  )
}

export default Signup

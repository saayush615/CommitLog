import React from 'react'
import axios from 'axios'
// Layout
import AuthLayout from '../components/AuthLayout'
// Icons
import Google from '../assets/google.svg'
import FB from '../assets/fb.svg'
// React-hook-form
import { useForm } from 'react-hook-form'
// Motion
import { motion, scale } from "motion/react"


const Login = () => {

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
  
    const onSubmit = (data) => console.log(data);

  return (
    <div>
      <AuthLayout title='Login'>
        <div className='flex flex-col w-full'>
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} action="">

            {/* username or email */}
            <input type="text" 
            placeholder='Enter your username or email' 
            {...register("usernameOrEmail",{
              required: { value: true, message: "username or email is required"}
            })} 
            className='border-2 border-neon text-white m-2 p-4 w-3/4 h-10' 
            />
            {errors.usernameOrEmail && (
              <p className="text-red-500 text-sm m-1">{errors.usernameOrEmail.message}</p>
            )}

            {/* password */}
            <input type="password" 
            placeholder='Enter your password' 
            {...register("password",{
              required: {value: true, message: "Password is required"}
            })} 
            className='border-2 border-neon text-white m-2 p-4 w-3/4 h-10' 
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}

            <motion.button type='submit' 
            className='text-black font-sans bg-white hover:bg-gray-300 p-3 m-2 rounded-xl cursor-pointer w-24 h-10 flex items-center justify-center'
            whileTap={{ scale:0.95 }}
            >Submit
            </motion.button>
          </form>

          {/* Continue with button */}
          <div className=' border-t-2 border-white border-dotted flex flex-col items-center'>
            <p>or</p>
            {/* Google */}
            <motion.div 
            className='bg-white hover:bg-gray-300 text-black font-sans cursor-pointer m-3 p-4 rounded-2xl flex justify-center items-center gap-1 w-3/4 h-14 md:1/2'
            whileTap={{ scale:0.95 }}
            >
              <img src={Google} alt="Google" className='h-8 md:h-12' />
              <p>Continue with google</p>
            </motion.div>
            {/* Fb */}
            <motion.div 
            className='bg-white hover:bg-gray-300 text-black font-sans cursor-pointer m-3 p-4 rounded-2xl flex justify-center items-center gap-1 w-3/4 h-14 md:1/2'
            whileTap={{ scale:0.95 }}
            >
              <img src={FB} alt="FB" className='h-8 md:h-12' />
              <p>Continue with facebook</p>
            </motion.div>
          </div>
        </div>
      </AuthLayout>
    </div>
  )
}

export default Login

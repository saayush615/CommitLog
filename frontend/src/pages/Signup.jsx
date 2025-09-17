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

const Signup = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);


  return (
    <div>
      <AuthLayout title='Sign-up'>
        <div className='flex flex-col w-full'>
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} action="">
            {/* firstname */}
            <input type="text" 
            placeholder='Enter your first name' 
            {...register("firstname",{
              required: { value: true, message: "First name is required"},
              pattern: {
                value: /^[^0-9]*$/,
                message: "First name cannot contain numbers"
              }
            })} 
            className='border-2 border-neon text-white m-2 p-4 w-3/4 h-10' 
            />
            {errors.firstname && (
              <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>
            )}

            {/* lastname */}
            <input type="text" 
            placeholder='Enter your last name' 
            {...register("lastname",{
              required: { value: true, message: "Last name is required"},
              pattern: {
                value: /^[^0-9]*$/,
                message: "Last name cannot contain numbers"
              }
            })} 
            className='border-2 border-neon text-white m-2 p-4 w-3/4 h-10' 
            />
            {errors.lastname && (
              <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>
            )}

            {/* username */}
            <input type="text" 
            placeholder='Enter unique username' 
            {...register("username",{
              required: { value: true, message: "username is required"}
            })} 
            className='border-2 border-neon text-white m-2 p-4 w-3/4 h-10' 
            />
            {errors.username && (
              <p className="text-red-500 text-sm m-1">{errors.username.message}</p>
            )}

            {/* email */}
            <input type="email" 
            placeholder='Enter your email' 
            {...register("email",{
              required: {value: true, message: "Email is required"},
              pattern: { 
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
                message: "Invalid email"
              }
            })} 
            className='border-2 border-neon text-white m-2 p-4 w-3/4 h-10' 
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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

export default Signup

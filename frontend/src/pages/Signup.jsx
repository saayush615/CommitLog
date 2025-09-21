import React, { useState } from 'react'
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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset, // It clears the form (or sets it to specific values), removing any user input and validation errors.
    watch, // observe the value of form fields in real-time, returns the current value of a field
    formState: { errors },
  } = useForm();

  const password = watch("password", ""); //  second argument "" is the default value if nothing is entered yet

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      // Remove confirmPassword from data before sending to API
      const { confirmPassword, ...submitData } = data;

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/`,submitData);
      console.log(response); // debugging purpose
      setSuccessMsg("Account created successfully! You can now login.");
      reset();  // After a successful signup, reset() clears all the fields so the form is empty again.
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message || "Signup failed.")
      } else {
        setErrorMsg("Network error. Please try again.")
      }
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add Google OAuth handler
  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };


  return (
    <div>
      <AuthLayout title='Sign-up'>
        <div className='flex flex-col w-full'>

          {/* Success/Error Messages */}
          {successMsg && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMsg}
            </div>
          )}
  
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

            {/* Confirm password */}
            <input type="password" 
            placeholder='Confirm your password' 
            {...register("confirmPassword",{
              required: {value: true, message: "Please confirm your password"},
              validate: value => value === password || "Passwords do not match"
            })} 
            className='border-2 border-neon text-white m-2 p-4 w-3/4 h-10' 
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}

            <motion.button 
            type='submit' 
            disabled={loading}
            className='text-black font-sans bg-white hover:bg-gray-300 p-3 m-2 rounded-xl cursor-pointer w-24 h-10 flex items-center justify-center'
            whileTap={!loading ? { scale:0.95 } : {}}
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </motion.button>
          </form>

          {/* Continue with button */}
          <div className=' border-t-2 border-white border-dotted flex flex-col items-center'>
            <p>or</p>
            {/* Google */}
            <motion.div 
            onClick={handleGoogleAuth}
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

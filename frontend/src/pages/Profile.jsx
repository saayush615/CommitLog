import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Mail, User as UserIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Card from '../components/Card'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import { useAuth } from '../hooks/useAuth'
import { getInitials } from '../utils/textUtils'
import { Spinner } from "@/components/ui/spinner"

const Profile = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [blogs, setBlogs] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)

    const { user } = useAuth();

    // Fetch user's blogs
    useEffect(() => {
        const fetchUserBlogs = async () => {
            if (!user) return
            // console.log(user)
            setLoading(true)
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/blog/read`, {
                    withCredentials: true
                })
                
                if (response.data.success) {
                    // Filter blogs by current user
                    const userBlogs = response.data.blogs.filter(
                        blog => blog.author._id === user.id || blog.author.username === user.username
                    )
                    setBlogs(userBlogs)
                }
            } catch (err) {
                console.error('Error fetching blogs:', err)
                setErrorMsg(err);
                toast.error('Failed to load blogs', {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "dark",
                    transition: Bounce,
                })
            } finally {
                setLoading(false)
            }
        }

        fetchUserBlogs()
    }, [user])

    // Handle delete Blog
    const handleBlogDelete = (deletedBlogId) => {
        setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== deletedBlogId));
    };

    // Format join date
    const formatJoinDate = (timestamp) => {
        if (!timestamp) return 'N/A'
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        })
    }

    if (errorMsg && !user) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <div className="text-red-500 text-lg mb-4">{errorMsg}</div>
                <Button onClick={() => navigate('/')} variant="outline">
                    Go Back Home
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />

            {/* Back Button */}
            <div className="p-4 md:p-6">
                <Button
                    onClick={() => navigate('/')}
                    variant="ghost"
                    className="text-white hover:text-gray-300 hover:bg-gray-800/50 transition-all duration-200"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </div>

            {/* Profile Header Section */}
            <div className="max-w-4xl mx-auto px-4 md:px-6 pb-8">
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-neon rounded-lg p-6 md:p-8 mb-8">
                    {/* Avatar and Basic Info */}
                    <div className="flex flex-col items-center text-center mb-6">
                        <Avatar className="w-24 h-24 md:w-32 md:h-32 mb-4 border-4 border-neon">
                            <AvatarImage src={user?.profilePicture} alt={user?.username} />
                            <AvatarFallback className="bg-neon text-black text-3xl font-bold">
                                {user ? 
                                    getInitials(user.firstname, user.lastname) : 
                                    <UserIcon className="h-5 w-5" />
                                }
                            </AvatarFallback>
                        </Avatar>

                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            {user?.firstname || 'Anonymous'}
                        </h1>
                        
                        <p className="text-gray-400 text-sm md:text-base">
                            @{user?.username || 'user'}
                        </p>
                    </div>

                    {/* User Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                            <UserIcon className="h-5 w-5 text-neon" />
                            <div>
                                <p className="text-gray-400 text-sm">Full Name</p>
                                <p className="text-white font-medium">
                                    {user?.firstname && user?.lastname 
                                        ? `${user.firstname} ${user.lastname}` 
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                            <Mail className="h-5 w-5 text-neon" />
                            <div>
                                <p className="text-gray-400 text-sm">Email</p>
                                <p className="text-white font-medium break-all">
                                    {user?.email || 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                            <Calendar className="h-5 w-5 text-neon" />
                            <div>
                                <p className="text-gray-400 text-sm">Member Since</p>
                                <p className="text-white font-medium">
                                    {formatJoinDate(user?.createdAt)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                            <div className="h-5 w-5 text-neon flex items-center justify-center font-bold text-lg">
                                #
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Blogs</p>
                                <p className="text-white font-medium text-2xl">
                                    {blogs.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blogs Section */}
                <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b-2 border-neon pb-2">
                        My Blogs
                    </h2>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-white text-lg">Loading blogs...</div>
                        </div>
                    ) : blogs.length > 0 ? (
                        <div className="space-y-6">
                            {blogs.map((blog) => (
                                <Card
                                    key={blog._id}
                                    blogId={blog._id}
                                    title={blog.title}
                                    content={blog.content}
                                    username={blog.author.username}
                                    publishdate={blog.updatedAt}
                                    likesCount={blog.likesCount}
                                    commentsCount={blog.commentsCount}
                                    isProfile={true}
                                    onDelete={handleBlogDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-900 rounded-lg border-2 border-dashed border-gray-700">
                            <p className="text-gray-400 text-lg mb-4">
                                You haven't written any blogs yet
                            </p>
                            <Button
                                onClick={() => navigate('/CreateBlog')}
                                className="bg-neon text-black hover:bg-neon/80 font-bold"
                            >
                                Create Your First Blog
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile
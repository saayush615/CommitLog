import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BlogActionSidebar from '../components/BlogActionSidebar';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Heart, MessageCircle, Share } from 'lucide-react';
import { ToastContainer, toast, Bounce } from 'react-toastify';

const ViewBlog = () => {
    const { id } = useParams(); // Get blog ID from URL
    const navigate = useNavigate();
    
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/blog/read/${id}`,
                { withCredentials: true } // This sends cookies
            );
                if (response.data.success) {
                    setBlog(response.data.blog._doc);
                    setLikesCount(response.data.blog._doc.likesCount);
                    setIsLiked(response.data.blog.isLiked); // Set isLiked from response
                }
            } catch (err) {
                console.error('Error fetching blog:', err);
                setError(err.response?.data?.error || 'Failed to fetch blog');
                toast.error('Failed to load blog', {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "dark",
                    transition: Bounce,
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog();
        }
    }, [id]);

    const handleToggleLike = async () => {
        try {
            const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/blog/${id}/like`,
            {}, // Empty object for request body (no data to send)
            { 
                withCredentials: true, // Config option - sends cookies
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            );
            // Check if response was successful
            if(response.data.success){
                setLikesCount(response.data.data.likesCount);
                setIsLiked(response.data.data.isLiked);
            } else {
                toast.error(response.data.error || 'Failed to toggle like', {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "dark",
                    transition: Bounce,
                });
            }
            
        } catch (err) {
            console.error('Error toggling like:', err);
            // Use the actual error from catch block
            const errorMessage = err.response?.data?.error || 'Failed to toggle like';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
                transition: Bounce,
            });
        }
    }
    

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[400px]">
                <div className="text-red-500 text-lg mb-4">
                    {error || 'Blog not found'}
                </div>
                <Button onClick={() => navigate('/')} variant="outline">
                    Go Back Home
                </Button>
            </div>
        );
    }

    return (
        <div>
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

            <div className='hidden md:block fixed h-full w-40'>
                <BlogActionSidebar 
                    isLiked={isLiked}
                    likesCount={likesCount} 
                    handleToggleLike={handleToggleLike}
                    commentsCount={blog.commentsCount} 
                />
            </div>

            <div className="max-w-4xl md:ml-40 lg:mx-auto p-4">
                {/* Back button */}
                <Button
                    onClick={() => navigate('/')}
                    variant="ghost"
                    className="mb-6 text-white hover:text-black md:hidden"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                {/* Blog header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4 leading-tight">
                        {blog.title}
                    </h1>
                    
                    <div className="flex items-center gap-6 text-gray-300 mb-6">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{blog.author.firstname} {blog.author.lastname}</span>
                            <span className="text-gray-500">@{blog.author.username}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(blog.createdAt)}</span>
                        </div>
                    </div>

                    {/* Cover image if exists */}
                    {blog.coverImage && (
                        <div className="mb-6">
                            <img
                                src={`${import.meta.env.VITE_API_URL}/${blog.coverImage}`}
                                alt={blog.title}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>
                    )}
                </div>

                {/* Blog content */}
                <div className="prose prose-invert max-w-none mb-8">
                    <div 
                        className="text-gray-100 leading-relaxed text-lg"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-4 py-6 border-t border-gray-700 md:hidden">
                    <Button variant="ghost" className="flex items-center gap-2 text-gray-300">
                        <Heart className="h-4 w-4" />
                        <span>{blog.likesCount || 0}</span>
                    </Button>
                    
                    <Button variant="ghost" className="flex items-center gap-2 text-gray-300">
                        <MessageCircle className="h-4 w-4" />
                        <span>{blog.commentsCount || 0}</span>
                    </Button>
                    
                    <Button variant="ghost" className="flex items-center gap-2 text-gray-300">
                        <Share className="h-4 w-4" />
                        <span>Share</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ViewBlog;
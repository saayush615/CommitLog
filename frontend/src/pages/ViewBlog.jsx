import React, { useState, useEffect, useRef  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BlogActionSidebar from '../components/BlogActionSidebar';
import CommentBox from '../components/CommentBox';
import CommentCard from '../components/CommentCard';
import ShareDialog from '../components/ShareDialog';
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft, Calendar, User, Heart, MessageCircle, Share } from 'lucide-react';
import { ToastContainer, toast, Bounce } from 'react-toastify';

const ViewBlog = () => {
    const { id } = useParams(); // Get blog ID from URL
    const navigate = useNavigate();

    const commentsRef = useRef(null);
    
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    const [comments, setComments] = useState([]);
    const [commentsCount, setCommentsCount] = useState(0);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/blog/read/${id}`,
                    { withCredentials: true } // This sends cookies
                );
                if (response.data.success) {
                    // console.log(response.data);
                    const blogData = response.data.blog._doc;
                    setBlog(blogData);
                    setLikesCount(blogData.likesCount);
                    setCommentsCount(blogData.commentsCount);
                    setIsLiked(response.data.blog.isLiked);
                    setComments(blogData.comments || []);
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

    const handleSubmitComment = async (commentContent) => {
        if (!commentContent.trim()) {
            toast.error('Comment cannot be empty', {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
                transition: Bounce,
            });
            return;
        }

        setIsSubmittingComment(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/blog/${id}/comment`,
                { content: commentContent },
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                // Add the new comment to the top of the list
                // console.log(response.data.data)
                setComments([response.data.data.comment, ...comments]);
                setCommentsCount(response.data.data.commentsCount);

                toast.success('Comment posted successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                    transition: Bounce,
                });
            } else {
                toast.error(response.data.error || 'Failed to post comment', {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "dark",
                    transition: Bounce,
                });
            }
        } catch (err) {
            console.error('Error posting comment:', err);
            const errorMessage = err.response?.data?.error || 'Failed to post comment';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
                transition: Bounce,
            });
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleScrollToComments = () => {
        commentsRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    };

    // Add share handler
    const handleShare = () => {
        setIsShareDialogOpen(true);
    };

    // Generate blog URL
    const blogUrl = `${window.location.origin}/blog/${id}`;


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
                <Spinner className='text-white' />
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
                <Button onClick={() => navigate('/')} variant="outline" className="text-black cursor-pointer">
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

            {/* Add ShareDialog */}
            <ShareDialog 
                isOpen={isShareDialogOpen}
                onClose={() => setIsShareDialogOpen(false)}
                blogUrl={blogUrl}
            />

            <div className='hidden md:block fixed h-full w-40'>
                <BlogActionSidebar 
                    isLiked={isLiked}
                    likesCount={likesCount} 
                    handleToggleLike={handleToggleLike}
                    commentsCount={commentsCount} 
                    onScrollToComments={handleScrollToComments}
                    onShare={handleShare}
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
                    Back to Home
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
                    <Button 
                        variant="ghost" 
                        className="flex items-center gap-2 text-gray-300"
                        onClick={() => handleToggleLike()}
                    >
                        <Heart className={`h-4 w-4 ${isLiked && 'fill-red-600'}`} />
                        <span>{blog.likesCount || 0}</span>
                    </Button>
                    
                    <Button variant="ghost" className="flex items-center gap-2 text-gray-300" onClick={handleShare}>
                        <Share className="h-4 w-4" />
                        <span>Share</span>
                    </Button>
                </div>

                {/* Comments Section */}
                <div ref={commentsRef} className="mt-8 border-t border-gray-700 pt-8">
                    <h2 className="text-2xl font-bold mb-6">
                        Comments ({commentsCount})
                    </h2>

                    {/* Comment Box */}
                    <div className="mb-6">
                        <CommentBox 
                            onSubmitComment={handleSubmitComment}
                            isSubmitting={isSubmittingComment}
                        />
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <CommentCard key={comment._id} comment={comment} />
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                No comments yet. Be the first to comment!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewBlog;
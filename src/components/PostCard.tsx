import React, { useState } from 'react';
import { format } from 'date-fns';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { Post } from '../lib/supabase';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => Promise<void>;
  onComment: (postId: string, content: string) => Promise<void>;
}

export default function PostCard({ post, onLike, onComment }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    try {
      await onLike(post.id);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onComment(post.id, commentContent);
      setCommentContent('');
      setShowComments(true);
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img 
            src={post.profiles?.avatar_url || 'https://via.placeholder.com/40'} 
            alt={post.profiles?.username || 'User'} 
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-medium">{post.profiles?.username || 'Anonymous'}</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(post.created_at), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <p className="mb-4">{post.content}</p>
      
      {post.image_url && (
        <img 
          src={post.image_url} 
          alt="Post content" 
          className="rounded-lg mb-4 w-full"
        />
      )}

      <div className="flex items-center justify-between text-gray-500 mb-4">
        <button 
          className={`flex items-center ${post.user_has_liked ? 'text-red-500' : 'hover:text-red-500'}`}
          onClick={handleLike}
        >
          <Heart className={`w-5 h-5 mr-1 ${post.user_has_liked ? 'fill-current' : ''}`} />
          {post.likes}
        </button>
        <button 
          className="flex items-center hover:text-blue-600"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="w-5 h-5 mr-1" />
          {post.comments}
        </button>
        <button className="flex items-center hover:text-blue-600">
          <Share2 className="w-5 h-5 mr-1" />
          Share
        </button>
      </div>

      {showComments && (
        <div className="border-t pt-4">
          <form onSubmit={handleComment} className="flex items-end mb-4">
            <TextareaAutosize
              placeholder="Write a comment..."
              className="flex-1 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              minRows={1}
              maxRows={5}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <button
              type="submit"
              disabled={!commentContent.trim() || isSubmitting}
              className="ml-2 p-2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
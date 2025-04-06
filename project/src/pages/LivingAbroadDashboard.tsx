import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search } from 'lucide-react';
import { usePosts, useGroups, useEvents } from '../hooks/useCommunity';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

export default function LivingAbroadDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'events'>('feed');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { posts, loading: postsLoading, createPost, likePost } = usePosts();
  const { groups, loading: groupsLoading, createGroup, joinGroup } = useGroups();
  const { events, loading: eventsLoading, createEvent, attendEvent } = useEvents();

  // Check authentication and profile on component mount
  useEffect(() => {
    checkAuthAndProfile();
  }, []);

  const checkAuthAndProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/living-abroad/login');
        return;
      }

      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile) {
        // Create profile if it doesn't exist
        const username = user.email?.split('@')[0] || `user_${Math.random().toString(36).slice(2, 7)}`;
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: username,
          })
          .select()
          .single();

        if (createProfileError) {
          console.error('Error creating profile:', createProfileError);
          navigate('/living-abroad/login');
          return;
        }
      }
    } catch (error) {
      console.error('Error checking auth and profile:', error);
      navigate('/living-abroad/login');
    }
  };

  const handleCreatePost = async (content: string, imageUrl?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/living-abroad/login');
        return;
      }

      // Verify profile exists before creating post
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile) {
        throw new Error('Please complete your profile before creating a post');
      }

      await createPost(content, imageUrl);
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/living-abroad/login');
        return;
      }
      await likePost(postId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/living-abroad/login');
        return;
      }

      const { error } = await supabase
        .from('comments')
        .insert({ 
          post_id: postId, 
          content,
          user_id: user.id
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const GroupCard = ({ group }: { group: any }) => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <img src={group.cover_image_url || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'} 
           alt={group.name} 
           className="w-full h-32 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{group.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{group.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{group.member_count} members</span>
          <button 
            onClick={() => joinGroup(group.id)}
            className={`px-4 py-2 rounded-lg ${
              group.is_member 
                ? 'bg-gray-100 text-gray-600' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {group.is_member ? 'Joined' : 'Join Group'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Community Connect</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowCreatePost(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Post
          </button>
          <button
            onClick={() => setShowCreateGroup(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <Users className="w-5 h-5 mr-2" />
            Create Group
          </button>
        </div>
      </div>

      <div className="flex mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts, groups, and events..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="ml-4">
          <div className="flex rounded-lg overflow-hidden">
            <button
              className={`px-4 py-2 ${activeTab === 'feed' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setActiveTab('feed')}
            >
              Feed
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'groups' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setActiveTab('groups')}
            >
              Groups
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'events' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setActiveTab('events')}
            >
              Events
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'feed' && (
            <div>
              {postsLoading ? (
                <div className="text-center py-8">Loading posts...</div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8">No posts yet. Be the first to post!</div>
              ) : (
                posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLikePost}
                    onComment={handleComment}
                  />
                ))
              )}
            </div>
          )}
          
          {activeTab === 'groups' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupsLoading ? (
                <div className="text-center py-8">Loading groups...</div>
              ) : groups.length === 0 ? (
                <div className="text-center py-8">No groups yet. Create one!</div>
              ) : (
                groups.map(group => (
                  <GroupCard key={group.id} group={group} />
                ))
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              {eventsLoading ? (
                <div className="text-center py-8">Loading events...</div>
              ) : events.length === 0 ? (
                <div className="text-center py-8">No upcoming events. Create one!</div>
              ) : (
                events.map(event => (
                  <div key={event.id} className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-2">{event.description}</p>
                    <div className="text-sm text-gray-500 mb-3">
                      <p>{format(new Date(event.start_time), 'PPP p')}</p>
                      <p>{event.location}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {event.attendee_count} attending
                      </span>
                      <button
                        onClick={() => attendEvent(event.id)}
                        className={`px-4 py-2 rounded-lg ${
                          event.is_attending
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {event.is_attending ? 'Attending' : 'Attend'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Your Groups</h2>
            <div className="space-y-3">
              {groups
                .filter(group => group.is_member)
                .slice(0, 3)
                .map(group => (
                  <div key={group.id} className="flex items-center">
                    <img 
                      src={group.cover_image_url || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'} 
                      alt={group.name} 
                      className="w-12 h-12 rounded object-cover mr-3" 
                    />
                    <div>
                      <h3 className="font-medium">{group.name}</h3>
                      <p className="text-sm text-gray-500">{group.member_count} members</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-3">
              {events
                .filter(event => new Date(event.start_time) > new Date())
                .slice(0, 3)
                .map(event => (
                  <div key={event.id} className="border-b last:border-0 pb-3 last:pb-0">
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(event.start_time), 'PPP')}
                    </p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleCreatePost}
        />
      )}

      {showCreateGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create Group</h2>
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                    placeholder="Describe your group"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image
                  </label>
                  <input
                    type="file"
                    className="w-full p-2 border rounded-lg"
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
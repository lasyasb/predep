import { useState, useEffect } from 'react';
import { supabase, type Post, type Group, type Event, type Story } from '../lib/supabase';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (*),
          likes:likes(count),
          comments:comments(count),
          user_has_liked:likes!inner(user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, imageUrl?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('posts')
        .insert({
          content,
          image_url: imageUrl,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      setPosts([data, ...posts]);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const likePost = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('likes')
        .insert({ 
          post_id: postId,
          user_id: user.id
        });

      if (error) throw error;
      await fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  };

  return { posts, loading, createPost, likePost };
}

export function useStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          profiles:user_id (*)
        `)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const createStory = async (mediaUrl: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('stories')
        .insert({
          media_url: mediaUrl,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      setStories([data, ...stories]);
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  };

  return { stories, loading, createStory };
}

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          member_count:group_members(count),
          is_member:group_members!inner(user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (name: string, description: string, location: string, coverImageUrl?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('groups')
        .insert({
          name,
          description,
          location,
          cover_image_url: coverImageUrl,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      setGroups([data, ...groups]);
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  };

  const joinGroup = async (groupId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('group_members')
        .insert({ 
          group_id: groupId,
          user_id: user.id
        });

      if (error) throw error;
      await fetchGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  };

  return { groups, loading, createGroup, joinGroup };
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          attendee_count:event_attendees(count),
          is_attending:event_attendees!inner(user_id)
        `)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (
    title: string,
    description: string,
    location: string,
    startTime: string,
    endTime?: string,
    groupId?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          title,
          description,
          location,
          start_time: startTime,
          end_time: endTime,
          group_id: groupId,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      setEvents([data, ...events]);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const attendEvent = async (eventId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('event_attendees')
        .insert({ 
          event_id: eventId,
          user_id: user.id
        });

      if (error) throw error;
      await fetchEvents();
    } catch (error) {
      console.error('Error attending event:', error);
      throw error;
    }
  };

  return { events, loading, createEvent, attendEvent };
}
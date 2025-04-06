import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  profiles: Profile;
  likes: number;
  comments: number;
  user_has_liked: boolean;
};

export type Story = {
  id: string;
  user_id: string;
  media_url: string;
  created_at: string;
  expires_at: string;
  profiles: Profile;
};

export type Group = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  cover_image_url: string | null;
  created_by: string;
  created_at: string;
  member_count: number;
  is_member: boolean;
};

export type Event = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  start_time: string;
  end_time: string | null;
  group_id: string | null;
  created_by: string;
  created_at: string;
  attendee_count: number;
  is_attending: boolean;
};

export async function uploadImage(file: File, bucket: 'avatars' | 'posts' | 'stories' | 'groups') {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${bucket}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
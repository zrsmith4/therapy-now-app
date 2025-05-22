import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'patient' | 'therapist' | 'admin' | null;

interface AuthData {
  user: User | null;
  session: Session | null;
  userRole: UserRole;
}

export const fetchUserRole = async (userId: string): Promise<UserRole> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    } else {
      return data?.role as UserRole;
    }
  } catch (error) {
    console.error('Failed to fetch user role:', error);
    return null;
  }
};

export const signUp = async (email: string, password: string, metadata?: any) => {
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });

  if (error) throw error;

  // Optional: Automatically set a default role if needed
  if (data.user) {
    await supabase.from('user_roles').insert({
      user_id: data.user.id,
      role: metadata?.role || 'patient' // Default to patient if no role specified
    });
  }

  return { data };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return { data };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getSession = async (): Promise<{ session: Session | null }> => {
  const { data } = await supabase.auth.getSession();
  return { session: data.session };
};

export const setupAuthStateListener = (callback: (authData: AuthData) => void) => {
  return supabase.auth.onAuthStateChange(async (_, session) => {
    const user = session?.user ?? null;
    
    // Initial auth state update without role
    callback({
      session,
      user,
      userRole: null
    });
    
    // Fetch user role if we have a user
    if (user) {
      // Use setTimeout to prevent potential Supabase auth deadlocks
      setTimeout(async () => {
        const userRole = await fetchUserRole(user.id);
        callback({
          session,
          user,
          userRole
        });
      }, 0);
    }
  });
};

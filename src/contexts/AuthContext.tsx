import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Profile, Teacher, Student, AppRole } from '@/types/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  teacher: Teacher | null;
  student: Student | null;
  roles: AppRole[];
  isLoading: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isParent: boolean;
  linkedChildren: Student[];
  activeChild: Student | null;
  setActiveChild: (child: Student | null) => void;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, role?: 'teacher' | 'student' | 'parent') => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [linkedChildren, setLinkedChildren] = useState<Student[]>([]);
  const [activeChild, setActiveChild] = useState<Student | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (profileData) {
        setProfile(profileData as Profile);
      }

      // Fetch teacher record
      const { data: teacherData } = await supabase
        .from('teachers')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (teacherData) {
        setTeacher(teacherData as Teacher);
      } else {
        setTeacher(null);
      }

      // Fetch student record
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (studentData) {
        setStudent(studentData as Student);
        
        // If this is a parent account, fetch linked children
        if (studentData.is_parent_account) {
          const { data: childrenData } = await supabase
            .from('students')
            .select('*')
            .eq('parent_id', studentData.id);
          
          if (childrenData && childrenData.length > 0) {
            setLinkedChildren(childrenData as Student[]);
            setActiveChild(childrenData[0] as Student);
          }
        }
      } else {
        setStudent(null);
        setLinkedChildren([]);
        setActiveChild(null);
      }

      // Fetch roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (rolesData) {
        setRoles(rolesData.map(r => r.role as AppRole));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Use setTimeout to avoid potential deadlock with Supabase client
          setTimeout(() => {
            fetchUserData(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
          setTeacher(null);
          setRoles([]);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        fetchUserData(existingSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'teacher' | 'student' | 'parent' = 'student') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setTeacher(null);
    setStudent(null);
    setLinkedChildren([]);
    setActiveChild(null);
    setRoles([]);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  const isTeacher = roles.includes('teacher');
  const isAdmin = roles.includes('admin');
  const isStudent = roles.includes('student');
  const isParent = isStudent && (student?.is_parent_account ?? false);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        teacher,
        student,
        roles,
        isLoading,
        isTeacher,
        isAdmin,
        isStudent,
        isParent,
        linkedChildren,
        activeChild,
        setActiveChild,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

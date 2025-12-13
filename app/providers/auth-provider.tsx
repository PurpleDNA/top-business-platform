/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import supabase from "@/client";
import { User } from "@supabase/supabase-js";
import { Payload } from "../components/login/SignupForm";
import { useRouter } from "next/navigation";

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
  signUpNewUser: (payload: Payload) => void;
  signInWithEmail: (payload: LoginPayload) => void;
  profile: any;
  isSuper:boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null as unknown as User,
  loading: true,
  signInWithGoogle: () => {},
  signOut: () => {},
  signUpNewUser: () => {},
  signInWithEmail: () => {},
  profile: null,
  isSuper:false
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export function AuthProvider({ children , isSuper}: { children: ReactNode , isSuper: boolean}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});

  const router = useRouter();
  useEffect(() => {
    // const getInitialSession = async () => {
    //   const {
    //     data: { session },
    //   } = await supabase.auth.getSession();

    //   setUser(session?.user ?? null);
    //   setLoading(false);
    //   if (!session?.user) {
    //     router.push("/login");
    //   }
    // };

    // getInitialSession();

    const getUserWithRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: userProfile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile({ ...user, profile: userProfile });
      }
      return null;
    };

    getUserWithRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (event === "SIGNED_OUT") {
        router.push("/login");
      }
    });

    return () => subscription?.unsubscribe();
  }, [router]);


  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `http://localhost:3000/`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  async function signUpNewUser(payload: Payload) {
    const { data: authData, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          display_name: `${payload.firstName} ${payload.lastName}`,
        },
        emailRedirectTo: "http://localhost:3000/",
      },
    });

    if (error) {
      throw new Error("Error occured");
    }

    return authData;
  }

  async function signInWithEmail(payload: LoginPayload) {
    const { error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });
    if (error) {
      throw new Error("Error signing in with Email");
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }
    // window.location.replace("http://localhost:3000/login");
  };

  const value = {
    user,
    loading,
    profile,
    signInWithGoogle,
    signOut,
    signUpNewUser,
    signInWithEmail,
    isSuper
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

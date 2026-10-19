import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getSiteSettings } from '../services/db';

export const DEFAULT_ADMIN_USERNAME = 'rmstar';
export const DEFAULT_ADMIN_PASSWORD = 'Admin2468';

interface AdminSessionUser {
  username: string;
  role: 'superadmin' | 'admin';
  loggedInAt: string;
}

interface AuthContextType {
  isAdmin: boolean;
  adminUser: AdminSessionUser | null;
  loading: boolean;
  loginError: string | null;
  loginWithCredentials: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  // Legacy compatibility helpers if any component still references them
  currentUser: { email: string; displayName: string } | null;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  loginSuccessMessage: string | null;
  clearSuccessMessage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const BOOTSTRAP_ADMIN_EMAIL = 'info@rmstar.online';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminSessionUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);

  // Check persisted admin session on load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('rmstar_admin_session');
      if (stored) {
        const parsed: AdminSessionUser = JSON.parse(stored);
        if (parsed && (parsed.username.toLowerCase() === DEFAULT_ADMIN_USERNAME.toLowerCase() || parsed.username === 'rmstar')) {
          setIsAdmin(true);
          setAdminUser(parsed);
          // Background anonymous sign-in to satisfy any Firebase rules if needed
          try {
            signInAnonymously(auth).catch(() => {});
          } catch {
            // ignore
          }
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithCredentials = async (username: string, password: string): Promise<boolean> => {
    setLoginError(null);
    setLoginSuccessMessage(null);

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setLoginError('يرجى إدخال اسم المستخدم وكلمة المرور.');
      return false;
    }

    // Check credentials against defaults or any updated credentials in siteSettings
    let expectedUser = DEFAULT_ADMIN_USERNAME;
    let expectedPass = DEFAULT_ADMIN_PASSWORD;

    try {
      const settings = await getSiteSettings();
      if (settings.adminUsername) expectedUser = settings.adminUsername;
      if (settings.adminPassword) expectedPass = settings.adminPassword;
    } catch {
      // use defaults
    }

    const isUserMatch =
      cleanUser.toLowerCase() === expectedUser.toLowerCase() ||
      cleanUser.toLowerCase() === DEFAULT_ADMIN_USERNAME.toLowerCase();

    const isPassMatch = cleanPass === expectedPass || cleanPass === DEFAULT_ADMIN_PASSWORD;

    if (isUserMatch && isPassMatch) {
      const sessionUser: AdminSessionUser = {
        username: 'rmstar',
        role: 'superadmin',
        loggedInAt: new Date().toISOString(),
      };
      setIsAdmin(true);
      setAdminUser(sessionUser);
      localStorage.setItem('rmstar_admin_session', JSON.stringify(sessionUser));

      // Attempt background anonymous auth for Firebase
      try {
        await signInAnonymously(auth);
      } catch {
        // Silently proceed; localStorage and dual persistence guarantees operation
      }

      setLoginSuccessMessage('تم تسجيل الدخول بنجاح. مرحباً بك في لوحة تحكم آر إم ستار.');
      return true;
    }

    setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة. يرجى استخدام rmstar و Admin2468.');
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setAdminUser(null);
    localStorage.removeItem('rmstar_admin_session');
    setLoginError(null);
    setLoginSuccessMessage(null);
  };

  const clearError = () => setLoginError(null);
  const clearSuccessMessage = () => setLoginSuccessMessage(null);

  // Legacy fallback compatibility methods
  const signInWithEmail = async (email: string, pass: string): Promise<boolean> => {
    return loginWithCredentials(email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string): Promise<boolean> => {
    return loginWithCredentials(email, pass);
  };

  const sendPasswordReset = async (): Promise<boolean> => {
    setLoginSuccessMessage('بيانات الدخول الافتراضية للوحة التحكم هي: rmstar / Admin2468');
    return true;
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    return loginWithCredentials(DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD);
  };

  const currentUser = adminUser
    ? { email: 'info@rmstar.online', displayName: 'RM STAR SuperAdmin' }
    : null;

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        adminUser,
        loading,
        loginError,
        loginSuccessMessage,
        loginWithCredentials,
        logout,
        clearError,
        clearSuccessMessage,
        currentUser,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

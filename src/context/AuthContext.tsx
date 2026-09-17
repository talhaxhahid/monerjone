'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserPublic } from '@/types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AuthContextType {
  user: UserPublic | null;
  loading: boolean;
  unreadCount: number;
  login: (phone: string, pass: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (formData: any) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<UserPublic>) => void;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  playNotificationChime: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const playNotificationChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      [880, 1320].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + i * 0.11);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.11 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.11 + 0.22);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.11);
        osc.stop(now + i * 0.11 + 0.24);
      });
      setTimeout(() => ctx.close(), 700);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.unreadCount !== undefined) {
          setUnreadCount(data.unreadCount);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (phone: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error || 'লগইন ব্যর্থ হয়েছে' };
      }
      setUser(data.user);
      addToast(`স্বাগতম, ${data.user.firstName}!`, 'success');
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err.message || 'নেটওয়ার্ক ত্রুটি' };
    }
  };

  const signup = async (formData: any) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error || 'নিবন্ধন ব্যর্থ হয়েছে' };
      }
      setUser(data.user);
      addToast('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!', 'success');
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err.message || 'নেটওয়ার্ক ত্রুটি' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      addToast('লগআউট সম্পন্ন হয়েছে', 'info');
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    }
  };

  const updateUser = (data: Partial<UserPublic>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        unreadCount,
        login,
        signup,
        logout,
        refreshUser,
        updateUser,
        toasts,
        addToast,
        removeToast,
        playNotificationChime,
      }}
    >
      {children}

      {/* Global Toast Container */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md text-sm font-medium border flex items-center justify-between transition-all duration-300 animate-slide-in ${
              t.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-900/40'
                : t.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-900/40'
                : 'bg-slate-900/90 text-slate-100 border-amber-500/30 shadow-black/50'
            }`}
          >
            <span>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-3 text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

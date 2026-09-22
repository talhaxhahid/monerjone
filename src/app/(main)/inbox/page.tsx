'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  MessageCircle,
  Send,
  ArrowLeft,
  ShieldAlert,
  Search,
  CheckCheck
} from 'lucide-react';
import { bn, timeAgo } from '@/lib/utils';
import UpgradeModal from '@/components/ui/UpgradeModal';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { ConversationSummary, MessageItem } from '@/types';

function InboxContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toUserId = searchParams.get('to');
  const { user, loading: authLoading, addToast, playNotificationChime } = useAuth();

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [activeRecipient, setActiveRecipient] = useState<any>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState<boolean>(false);
  const [upgradeModalMsg, setUpgradeModalMsg] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load conversations list
  const loadConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
      // Keep the conversation list itself fresh too (new incoming
      // conversations, updated previews/unread counts), not just the
      // currently-open thread.
      const listInterval = setInterval(() => {
        loadConversations();
      }, 8000);
      return () => clearInterval(listInterval);
    }
  }, [user]);

  // If `?to=userId` query parameter exists, open or start that conversation
  useEffect(() => {
    async function startOrOpenTargetConv() {
      if (!toUserId || !user) return;
      try {
        const res = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetId: toUserId }),
        });
        const data = await res.json();
        if (res.ok && data.conversationId) {
          setActiveConvId(data.conversationId);
          setActiveRecipient(data.other);
          loadConversations();
        } else {
          addToast(data.error || 'কথোপকথন শুরু করা যায়নি', 'error');
        }
      } catch {
        addToast('কথোপকথন খুলতে সমস্যা হয়েছে', 'error');
      }
    }
    startOrOpenTargetConv();
  }, [toUserId, user]);

  // Load messages for the active conversation
  const loadMessages = async (convId: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/conversations/${convId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        setActiveRecipient(data.other);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
      // Auto-poll messages every 6 seconds
      const interval = setInterval(() => {
        loadMessages(activeConvId);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [activeConvId]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConvId || sending) return;

    const textToSend = messageText.trim();
    setMessageText('');
    setSending(true);

    try {
      const res = await fetch(`/api/conversations/${activeConvId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
        playNotificationChime();
        loadConversations();
      } else if (res.status === 422) {
        addToast(data.message || 'যোগাযোগের তথ্য ব্লক করা হয়েছে', 'error');
      } else if (res.status === 403) {
        if (data.error === 'FREE_LIMIT_REACHED') {
          setUpgradeModalMsg(data.message);
          setUpgradeModalOpen(true);
        } else {
          addToast(data.message || data.error, 'error');
        }
      } else {
        addToast(data.error || 'বার্তা পাঠানো সম্ভব হয়নি', 'error');
      }
    } catch {
      addToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setSending(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF4D7E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredConversations = conversations.filter((c) =>
    c.other.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto md:px-4 sm:px-6 lg:px-8 md:py-6">
      <div className="h-[calc(100dvh-4rem-3.5rem)] md:h-[80vh] md:min-h-[550px] md:rounded-3xl bg-[#1F1640]/95 md:border md:border-[#FF4D7E]/20 md:shadow-2xl backdrop-blur-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* ================= LEFT: CONVERSATIONS LIST ================= */}
        <div
          className={`md:col-span-4 lg:col-span-4 border-r border-white/10 flex flex-col h-full bg-[#150E2B]/80 ${
            activeConvId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* List Header */}
          <div className="p-4 border-b border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#F5F3FA] flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#FF4D7E]" />
                <span>মেসেজ ইনবক্স</span>
              </h2>
              {user.premium === 'Free' && (
                <span className="text-[10px] font-bold text-[#F5B942] bg-[#F5B942]/10 px-2 py-0.5 rounded-full border border-[#F5B942]/30">
                  ফ্রি (সীমিত মেসেজ)
                </span>
              )}
            </div>

            {/* Search filter input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#8B7FA8] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="ইনবক্স সার্চ করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#150E2B] border border-white/10 text-xs text-[#F5F3FA] focus:outline-none focus:border-[#FF4D7E] placeholder:text-[#8B7FA8]"
              />
            </div>
          </div>

          {/* Conversations Items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loadingList ? (
              <div className="p-6 text-center text-xs text-[#8B7FA8]">লোড হচ্ছে...</div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((c) => {
                const isSelected = activeConvId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveConvId(c.id);
                      setActiveRecipient(c.other);
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all text-left ${
                      isSelected
                        ? 'bg-[#FF4D7E]/15 border border-[#FF4D7E]/40 text-[#F5F3FA] shadow-md'
                        : 'hover:bg-[#1F1640]/80 text-[#B9AFD1]'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#331A5C] shrink-0 border border-[#FF4D7E]/20">
                      <ImageWithFallback
                        src={c.other.photoUrl}
                        alt={c.other.name}
                        name={c.other.name}
                        fallbackType="avatar"
                        className="w-full h-full object-cover"
                      />
                      {c.other.active && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#150E2B] z-20" />
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F5F3FA] truncate">
                          {c.other.name}
                        </span>
                        <span className="text-[10px] text-[#8B7FA8]">
                          {timeAgo(c.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-xs text-[#8B7FA8] truncate mt-0.5">
                        {c.lastMessage?.text || 'নতুন কথোপকথন'}
                      </p>
                    </div>

                    {/* Unread badge */}
                    {c.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#FF4D7E] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {c.unread}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-[#8B7FA8] space-y-2">
                <p>কোনো মেসেজ পাওয়া যায়নি</p>
                <p className="text-[11px] text-[#8B7FA8]">
                  পাত্র-পাত্রী সার্চ করে সরাসরি বার্তা পাঠান
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT: ACTIVE CHAT SCREEN ================= */}
        <div
          className={`md:col-span-8 lg:col-span-8 flex flex-col h-full bg-[#150E2B]/50 ${
            !activeConvId ? 'hidden md:flex items-center justify-center' : 'flex'
          }`}
        >
          {activeConvId && activeRecipient ? (
            <>
              {/* Chat Top Header */}
              <div className="p-4 border-b border-white/10 bg-[#150E2B]/90 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveConvId(null)}
                    className="md:hidden p-1.5 rounded-lg text-[#8B7FA8] hover:text-[#F5F3FA]"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#331A5C] border border-[#FF4D7E]/20 shrink-0">
                    <ImageWithFallback
                      src={activeRecipient.photoUrl}
                      alt={activeRecipient.name}
                      name={activeRecipient.name}
                      fallbackType="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#F5F3FA] flex items-center gap-1.5">
                      <span>{activeRecipient.name}</span>
                      {activeRecipient.premium !== 'Free' && (
                        <span className="text-[10px] text-[#F5B942] bg-[#F5B942]/10 px-1.5 py-0.2 rounded font-mono">
                          👑 {bn(activeRecipient.premium)}
                        </span>
                      )}
                    </h3>
                    <span className="text-[11px] text-[#8B7FA8]">
                      {activeRecipient.active ? (
                        <span className="text-emerald-400">অনলাইনে আছেন</span>
                      ) : (
                        `সর্বশেষ সক্রিয়: ${timeAgo(activeRecipient.lastActive)}`
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/profile/${activeRecipient.id}`)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#331A5C] hover:bg-[#4B2380] text-[#F5F3FA] border border-white/10 transition-all cursor-pointer"
                >
                  বায়োডাটা দেখুন
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
                {/* Security alert banner inside chat */}
                <div className="p-3 rounded-2xl bg-[#FF4D7E]/10 border border-[#FF4D7E]/20 text-center text-xs text-[#FF4D7E] flex items-center justify-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>
                    শালীন ও ইসলামিক শিষ্টাচার বজায় রেখে আলোচনা করুন।
                  </span>
                </div>

                {loadingMessages ? (
                  <div className="py-8 text-center text-xs text-[#8B7FA8]">মেসেজ লোড হচ্ছে...</div>
                ) : messages.length > 0 ? (
                  messages.map((m) => {
                    const isMe = m.from === user.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isMe
                              ? 'bg-gradient-to-r from-[#FF4D7E] to-[#E63465] text-white font-medium rounded-br-none shadow-md'
                              : 'bg-[#1F1640] text-[#F5F3FA] rounded-bl-none border border-white/10 shadow-sm'
                          }`}
                        >
                          <p>{m.text}</p>
                        </div>
                        <span className="text-[10px] text-[#8B7FA8] mt-1 px-1 flex items-center gap-1">
                          <span>{timeAgo(m.at)}</span>
                          {isMe && <CheckCheck className="w-3 h-3 text-sky-400 inline" />}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-16 text-center text-xs text-[#8B7FA8]">
                    এখনও কোনো বার্তা আদান-প্রদান করা হয়নি। সালাম দিয়ে আলোচনা শুরু করুন।
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Field Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 border-t border-white/10 bg-[#150E2B] flex items-center gap-2"
              >
                <input
                  type="text"
                  name="mj-chat-message"
                  placeholder="মেসেজ লিখুন..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  autoComplete="off"
                  autoCorrect="off"
                  data-lpignore="true"
                  data-1p-ignore
                  data-form-type="other"
                  className="flex-1 px-4 py-3 rounded-2xl bg-[#1F1640] border border-white/10 text-[#F5F3FA] text-xs sm:text-sm focus:outline-none focus:border-[#FF4D7E] placeholder:text-[#8B7FA8]"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() || sending}
                  className="p-3 rounded-2xl bg-[#FF4D7E] hover:bg-[#E63465] text-white shadow-md shadow-[#FF4D7E]/20 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="p-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#1F1640] flex items-center justify-center text-[#FF4D7E] mx-auto text-2xl border border-white/10">
                💬
              </div>
              <h3 className="text-base font-bold text-[#F5F3FA]">কথোপকথন নির্বাচন করুন</h3>
              <p className="text-xs text-[#B9AFD1] max-w-xs mx-auto">
                বাম পাশের তালিকা থেকে যেকোনো পাত্র বা পাত্রীর প্রোফাইল বেছে নিয়ে চ্যাটিং শুরু করুন।
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="মেম্বারশিপ আপগ্রেড প্রয়োজন"
        description={upgradeModalMsg || 'সীমাহীন বার্তা প্রেরণ ও সরাসরি যোগাযোগের জন্য আপনার প্যাকেজ আপগ্রেড করুন।'}
      />
    </div>
  );
}

export default function InboxPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">লোড হচ্ছে...</div>}>
      <InboxContent />
    </Suspense>
  );
}

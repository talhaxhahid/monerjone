'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  MessageCircle,
  Send,
  ArrowLeft,
  Search,
  Check,
  CheckCheck
} from 'lucide-react';
import { bn, timeAgo } from '@/lib/utils';
import UpgradeModal from '@/components/ui/UpgradeModal';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { ConversationSummary, MessageItem } from '@/types';

// Poll results are usually identical to what's already on screen. Comparing
// first lets us skip the state update entirely (no re-render, no scroll jump).
function sameMessages(a: MessageItem[], b: MessageItem[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id || (a[i].readAt || null) !== (b[i].readAt || null)) return false;
  }
  return true;
}

function InboxContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toUserId = searchParams.get('to');
  // The open conversation lives in the URL (/inbox?c=ID) so the phone's back
  // button / browser history steps chat -> inbox list, like Messenger.
  const activeConvId = searchParams.get('c');
  const { user, loading: authLoading, addToast, playNotificationChime, refreshUser } = useAuth();

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeRecipient, setActiveRecipient] = useState<any>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState<boolean>(false);
  const [upgradeModalMsg, setUpgradeModalMsg] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [viewport, setViewport] = useState<{ height: number; top: number } | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const lastRenderedCountRef = useRef<number>(0);
  const openedFromInboxRef = useRef<boolean>(false);
  const activeConvIdRef = useRef<string | null>(activeConvId);
  activeConvIdRef.current = activeConvId;
  const prevUnreadTotalRef = useRef<number>(0);
  const prevMessageCountRef = useRef<number>(0);
  const isFirstConvListLoadRef = useRef<boolean>(true);
  const isFirstMessagesLoadRef = useRef<boolean>(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Mobile = full-screen messenger-style chat. Desktop = 2-pane layout.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const showPortalChat = isMobile && !!activeConvId;

  // Track the *visible* viewport so the mobile chat always fills exactly the
  // area above the keyboard: header stays pinned at the top, composer sits
  // right on top of the keyboard, no dead gap.
  useEffect(() => {
    if (!showPortalChat) {
      setViewport(null);
      return;
    }
    const vv = window.visualViewport;
    const update = () =>
      setViewport({
        height: vv ? vv.height : window.innerHeight,
        top: vv ? vv.offsetTop : 0,
      });
    update();
    vv?.addEventListener('resize', update);
    vv?.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => {
      vv?.removeEventListener('resize', update);
      vv?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [showPortalChat]);

  // Lock the page behind the full-screen chat so it can never scroll/bounce.
  useEffect(() => {
    if (!showPortalChat) return;
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.documentElement.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overscrollBehavior = prevOverscroll;
    };
  }, [showPortalChat]);

  // Load conversations list
  const loadConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        const list: ConversationSummary[] = data.conversations || [];
        setConversations(list);

        const totalUnread = list.reduce((sum, c) => sum + (c.unread || 0), 0);
        if (!isFirstConvListLoadRef.current && totalUnread > prevUnreadTotalRef.current) {
          // A new incoming message raised the unread total — this is the
          // receiver's device, so this is the correct place to chime.
          playNotificationChime();
        }
        prevUnreadTotalRef.current = totalUnread;
        isFirstConvListLoadRef.current = false;
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
      const listInterval = setInterval(() => {
        loadConversations();
      }, 8000);
      return () => clearInterval(listInterval);
    }
  }, [user]);

  // If `?to=userId` exists (e.g. "মেসেজ দিন" on a profile), open or start
  // that conversation. History ends up as [.., /inbox, /inbox?c=ID] so the
  // back button returns to the inbox list.
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
          setActiveRecipient(data.other);
          openedFromInboxRef.current = true;
          router.replace('/inbox');
          router.push(`/inbox?c=${data.conversationId}`);
          loadConversations();
        } else {
          addToast(data.error || 'কথোপকথন শুরু করা যায়নি', 'error');
        }
      } catch {
        addToast('কথোপকথন খুলতে সমস্যা হয়েছে', 'error');
      }
    }
    startOrOpenTargetConv();
  }, [toUserId, user]);

  // Load messages for the active conversation. Only the very first load
  // shows a loading state — background polls must never swap the message
  // list out for a spinner (that reset the scroll position every few seconds).
  const loadMessages = async (convId: string, isFirstLoad: boolean = false) => {
    if (isFirstLoad) setLoadingMessages(true);
    try {
      const res = await fetch(`/api/conversations/${convId}/messages`);
      if (activeConvIdRef.current !== convId) return; // user already left/switched
      if (res.ok) {
        const data = await res.json();
        const newMessages: MessageItem[] = data.messages || [];

        if (
          !isFirstMessagesLoadRef.current &&
          newMessages.length > prevMessageCountRef.current
        ) {
          const latest = newMessages[newMessages.length - 1];
          // Only chime for messages that just arrived FROM the other person.
          if (latest && latest.from !== user?.id) {
            playNotificationChime();
          }
        }
        prevMessageCountRef.current = newMessages.length;
        isFirstMessagesLoadRef.current = false;

        setMessages((prev) => (sameMessages(prev, newMessages) ? prev : newMessages));
        setActiveRecipient(data.other);
        // Opening a conversation marks its messages read server-side;
        // refresh the global unread badge right away.
        if (isFirstLoad) {
          refreshUser();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isFirstLoad) setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      setActiveRecipient(null);
      return;
    }
    prevMessageCountRef.current = 0;
    isFirstMessagesLoadRef.current = true;
    lastRenderedCountRef.current = 0;
    setMessages([]);
    loadMessages(activeConvId, true);
    const interval = setInterval(() => {
      if (!document.hidden) loadMessages(activeConvId);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeConvId]);

  // Keep the chat scrolled to the newest message — by scrolling ONLY the
  // message list itself (never scrollIntoView, which also scrolls the page),
  // and only when something new actually arrived.
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el || messages.length === 0) return;
    const prevCount = lastRenderedCountRef.current;
    if (messages.length <= prevCount) return;
    const isFirst = prevCount === 0;
    const last = messages[messages.length - 1];
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 160;
    if (isFirst || last.from === user?.id || nearBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: isFirst ? 'auto' : 'smooth' });
    }
    lastRenderedCountRef.current = messages.length;
  }, [messages]);

  const openConversation = (c: ConversationSummary) => {
    openedFromInboxRef.current = true;
    setActiveRecipient(c.other);
    // Optimistically clear this conversation's unread badge right away.
    setConversations((prev) =>
      prev.map((conv) => (conv.id === c.id ? { ...conv, unread: 0 } : conv))
    );
    router.push(`/inbox?c=${c.id}`);
  };

  // Back arrow => the inbox list. If we got here from the list, stepping back
  // in history keeps things tidy; otherwise just swap the URL.
  const closeConversation = () => {
    if (openedFromInboxRef.current) {
      router.back();
    } else {
      router.replace('/inbox');
    }
  };

  const sendCurrent = async (override?: string) => {
    const textToSend = (override ?? messageText).trim();
    if (!textToSend || !activeConvId || sending) return;

    setMessageText('');
    if (composerRef.current) composerRef.current.textContent = '';
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
        prevMessageCountRef.current += 1;
        loadConversations();
      } else if (res.status === 422) {
        addToast(data.message || 'যোগাযোগের তথ্য ব্লক করা হয়েছে', 'error');
      } else if (res.status === 403) {
        if (data.error === 'FREE_LIMIT_REACHED') {
          setUpgradeModalMsg(data.message);
          setUpgradeModalOpen(true);
        } else {
          addToast(data.message || data.error, 'error');
        }
      } else {
        addToast(data.error || 'বার্তা পাঠানো সম্ভব হয়নি', 'error');
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

  const recipient =
    activeRecipient || conversations.find((c) => c.id === activeConvId)?.other || null;

  // The chat screen (header + messages + composer). Rendered inline on
  // desktop, or in a full-screen portal on mobile.
  const renderChatPanel = () => {
    if (!activeConvId) return null;
    if (!recipient) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#FF4D7E] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
    return (
      <>
        {/* Chat Top Header — pinned; never scrolls away */}
        <div className="shrink-0 px-3 py-3 sm:p-4 border-b border-white/10 bg-[#150E2B] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={closeConversation}
              aria-label="ইনবক্সে ফিরে যান"
              className="md:hidden p-2 -ml-1 rounded-lg text-[#B9AFD1] hover:text-[#F5F3FA] active:bg-white/5"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative w-10 h-10 shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#331A5C] border border-[#FF4D7E]/20">
                <ImageWithFallback
                  src={recipient.photoUrl}
                  alt={recipient.name}
                  name={recipient.name}
                  fallbackType="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {recipient.active && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#150E2B]" />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#F5F3FA] flex items-center gap-1.5">
                <span className="truncate">{recipient.name}</span>
                {recipient.premium !== 'Free' && (
                  <span className="text-[10px] text-[#F5B942] bg-[#F5B942]/10 px-1.5 py-0.5 rounded shrink-0">
                    {bn(recipient.premium)}
                  </span>
                )}
              </h3>
              <span className="text-[11px] text-[#8B7FA8] block truncate">
                {recipient.active ? (
                  <span className="text-emerald-400">অনলাইনে আছেন</span>
                ) : (
                  `সর্বশেষ সক্রিয়: ${timeAgo(recipient.lastActive)}`
                )}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push(`/profile/${recipient.id}`)}
            className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#331A5C] hover:bg-[#4B2380] text-[#F5F3FA] border border-white/10 transition-all cursor-pointer"
          >
            বায়োডাটা দেখুন
          </button>
        </div>

        {/* Chat Messages Body — the ONLY thing that scrolls */}
        <div
          ref={messagesContainerRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-3.5"
        >
          {loadingMessages && messages.length === 0 ? (
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
                    className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                      isMe
                        ? 'bg-gradient-to-r from-[#FF4D7E] to-[#E63465] text-white font-medium rounded-br-none shadow-md'
                        : 'bg-[#1F1640] text-[#F5F3FA] rounded-bl-none border border-white/10 shadow-sm'
                    }`}
                  >
                    <p>{m.text}</p>
                  </div>
                  <span className="text-[10px] text-[#8B7FA8] mt-1 px-1 flex items-center gap-1">
                    <span>{timeAgo(m.at)}</span>
                    {isMe &&
                      (m.readAt ? (
                        <CheckCheck className="w-3 h-3 text-sky-400 inline" />
                      ) : (
                        <Check className="w-3 h-3 text-[#8B7FA8] inline" />
                      ))}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center text-xs text-[#8B7FA8]">
              এখনও কোনো বার্তা আদান-প্রদান করা হয়নি। সালাম দিয়ে আলোচনা শুরু করুন।
            </div>
          )}
        </div>

        {/* Composer. A contentEditable box (not <input>/<textarea>) — browsers
            only show their password/card/address autofill bar above the
            keyboard for real form fields, so this never triggers it. */}
        <div className="shrink-0 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] border-t border-white/10 bg-[#150E2B] flex items-end gap-2">
          <div
            ref={composerRef}
            role="textbox"
            aria-label="মেসেজ লিখুন"
            aria-multiline="true"
            contentEditable
            suppressContentEditableWarning
            translate="no"
            spellCheck={false}
            autoCapitalize="off"
            data-placeholder="মেসেজ লিখুন..."
            enterKeyHint="send"
            onInput={(e) => {
              const el = e.currentTarget;
              const inputType = (e.nativeEvent as InputEvent).inputType;
              if (inputType === 'insertParagraph' || inputType === 'insertLineBreak') {
                // Mobile "send" key: swallow the newline and send instead.
                const cleaned = (el.innerText || '').replace(/[\r\n]+/g, ' ').trim();
                el.textContent = cleaned;
                setMessageText(cleaned);
                sendCurrent(cleaned);
                return;
              }
              const text = el.textContent || '';
              if (!text) el.innerHTML = '';
              setMessageText(text);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                sendCurrent();
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const pasted = e.clipboardData.getData('text/plain').replace(/[\r\n]+/g, ' ');
              document.execCommand('insertText', false, pasted);
            }}
            className="flex-1 min-w-0 min-h-[44px] max-h-32 overflow-y-auto px-4 py-3 rounded-2xl bg-[#1F1640] border border-white/10 text-[#F5F3FA] text-sm leading-snug whitespace-pre-wrap break-words focus:outline-none focus:border-[#FF4D7E] select-text"
          />
          <button
            type="button"
            // Keep the keyboard open when tapping send (don't steal focus).
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => sendCurrent()}
            disabled={!messageText.trim() || sending}
            aria-label="পাঠান"
            className="shrink-0 w-11 h-11 rounded-2xl bg-[#FF4D7E] hover:bg-[#E63465] text-white flex items-center justify-center disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="max-w-7xl mx-auto md:px-4 sm:px-6 lg:px-8 md:py-6">
      {/* No backdrop-blur on mobile: it creates a containing block that breaks
          fixed positioning and causes GPU shadow-tiling glitches on Android. */}
      <div className="h-[calc(100dvh-4rem-3.5rem)] md:h-[80vh] md:min-h-[550px] md:rounded-3xl bg-[#1F1640] md:bg-[#1F1640]/95 md:border md:border-[#FF4D7E]/20 md:shadow-2xl md:backdrop-blur-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">

        {/* ================= LEFT: CONVERSATIONS LIST ================= */}
        <div
          className={`md:col-span-4 lg:col-span-4 border-r border-white/10 flex flex-col h-full min-h-0 bg-[#150E2B]/80 ${
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
                autoComplete="off"
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#150E2B] border border-white/10 text-xs text-[#F5F3FA] focus:outline-none focus:border-[#FF4D7E] placeholder:text-[#8B7FA8]"
              />
            </div>
          </div>

          {/* Conversations Items */}
          <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1">
            {loadingList ? (
              <div className="p-6 text-center text-xs text-[#8B7FA8]">লোড হচ্ছে...</div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((c) => {
                const isSelected = activeConvId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => openConversation(c)}
                    className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all text-left ${
                      isSelected
                        ? 'bg-[#FF4D7E]/15 border border-[#FF4D7E]/40 text-[#F5F3FA] shadow-md'
                        : 'hover:bg-[#1F1640]/80 text-[#B9AFD1]'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative w-12 h-12 shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-[#331A5C] border border-[#FF4D7E]/20">
                        <ImageWithFallback
                          src={c.other.photoUrl}
                          alt={c.other.name}
                          name={c.other.name}
                          fallbackType="avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
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
                <p>কোনো মেসেজ পাওয়া যায়নি</p>
                <p className="text-[11px] text-[#8B7FA8]">
                  পাত্র-পাত্রী সার্চ করে সরাসরি বার্তা পাঠান
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT: CHAT (desktop, inline) ================= */}
        <div className="hidden md:flex md:col-span-8 lg:col-span-8 flex-col h-full min-h-0 bg-[#150E2B]/50">
          {activeConvId && !showPortalChat ? (
            renderChatPanel()
          ) : !activeConvId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="p-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#1F1640] flex items-center justify-center text-[#FF4D7E] mx-auto border border-white/10">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-[#F5F3FA]">কথোপকথন নির্বাচন করুন</h3>
                <p className="text-xs text-[#B9AFD1] max-w-xs mx-auto">
                  বাম পাশের তালিকা থেকে যেকোনো পাত্র বা পাত্রীর প্রোফাইল বেছে নিয়ে চ্যাটিং শুরু করুন।
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* ================= MOBILE: full-screen chat (portal to <body>) =================
          Rendered outside the page tree so nothing (navbar, bottom nav, wrapper
          blur) can sit on top of or clip it. Sized to the visible viewport so
          the keyboard pushes the composer up while the header stays put. */}
      {showPortalChat &&
        createPortal(
          <div
            className="fixed left-0 right-0 z-[45] flex flex-col bg-[#150E2B]"
            style={{ top: viewport?.top ?? 0, height: viewport ? viewport.height : '100dvh' }}
          >
            {renderChatPanel()}
          </div>,
          document.body
        )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="মেম্বারশিপ আপগ্রেড প্রয়োজন"
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

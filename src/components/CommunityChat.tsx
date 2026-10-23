import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  HelpCircle, 
  Crown, 
  Diamond, 
  Zap, 
  Terminal, 
  User as UserIcon, 
  Flame, 
  ThumbsUp, 
  Smile, 
  ShieldCheck,
  CheckCircle2,
  Users
} from 'lucide-react';
import { ChatMessage, User } from '../types';
import { INITIAL_CHAT_MESSAGES } from '../data/initialData';
import { sounds } from '../utils/audio';

interface CommunityChatProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const CommunityChat: React.FC<CommunityChatProps> = ({
  currentUser,
  onOpenAuth,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [isDoubtMode, setIsDoubtMode] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    sounds.playTap();

    const senderRole = currentUser.adminTitle || (currentUser.role === 'admin' ? 'Admin' : 'Student');
    let badgeColor = '#c084fc';
    if (senderRole.includes('Owner')) badgeColor = '#FF0055';
    else if (senderRole.includes('Co-founder')) badgeColor = '#8A2BE2';
    else if (senderRole.includes('CEO')) badgeColor = '#ff007f';
    else if (senderRole.includes('IT Head')) badgeColor = '#00e5ff';
    else if (currentUser.role === 'admin') badgeColor = '#FF0055';

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: senderRole,
      avatar: currentUser.avatar,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: { '🔥': 1 },
      isDoubt: isDoubtMode,
      badgeColor,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsDoubtMode(false);

    // If student asked a doubt question, simulate an encouraging answer from Haider or Gentleman after 1.8s
    if (isDoubtMode && currentUser.role === 'student') {
      setTimeout(() => {
        sounds.playCorrect();
        const autoReply: ChatMessage = {
          id: 'msg_reply_' + Date.now(),
          senderId: 'admin_1',
          senderName: 'Haider',
          senderRole: 'Owner',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          text: `Great question, ${currentUser.fullName}! In QP Community drills, always eliminate the 2 furthest distractors first. That immediately shifts mathematical odds into net positive territory! 🎯`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: { '👏': 5, '❤️': 3 },
          badgeColor: '#FF0055'
        };
        setMessages((prev) => [...prev, autoReply]);
      }, 1800);
    }
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    sounds.playTap();
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          const currentReactions = { ...(m.reactions || {}) };
          currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
          return { ...m, reactions: currentReactions };
        }
        return m;
      })
    );
  };

  const handleQuickPrompt = (promptText: string) => {
    sounds.playTap();
    setInputText(promptText);
  };

  const getRoleIcon = (role: string) => {
    if (role.includes('Owner')) return <Crown className="w-3 h-3 text-[#FF0055] fill-[#FF0055]" />;
    if (role.includes('Co-founder')) return <Diamond className="w-3 h-3 text-[#8A2BE2] fill-[#8A2BE2]" />;
    if (role.includes('CEO')) return <Zap className="w-3 h-3 text-pink-400 fill-pink-400" />;
    if (role.includes('IT Head')) return <Terminal className="w-3 h-3 text-cyan-400" />;
    if (role.includes('Admin')) return <ShieldCheck className="w-3 h-3 text-emerald-400" />;
    return <UserIcon className="w-3 h-3 text-purple-300" />;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fadeIn">
      {/* Top Chat Header Strip */}
      <div className="px-4 py-3 bg-[#0e021a]/90 backdrop-blur-md border-b border-purple-500/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF0055] to-[#8A2BE2] flex items-center justify-center shadow-[0_0_12px_#FF0055]">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-sm text-white">
                Unified Community Chat
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
            </div>
            <p className="text-[10px] text-purple-300">
              Live discussion room · 48 active members online
            </p>
          </div>
        </div>

        {/* Quick Team Online Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-[10px] text-slate-300">
          <span className="text-[#FF0055] font-bold">Leadership Active</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {/* Welcome Notice Card in Dark Red-Purple Glassmorphism */}
        <div className="p-3.5 rounded-2xl glass-panel-glow border border-purple-500/25 text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] to-[#8A2BE2]">
            Official Question Practice Community Commons
          </span>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
            Collaborate with peers, ask academic doubts, and discuss elimination strategies with Haider (Owner), Aritra (Co-founder), Ranbir (CEO), and Gentleman (IT Head).
          </p>
        </div>

        {/* Message Stream */}
        {messages.map((msg) => {
          const isCurrentUser = currentUser?.id === msg.senderId;
          const isLeadership = 
            msg.senderRole.includes('Owner') || 
            msg.senderRole.includes('Co-founder') || 
            msg.senderRole.includes('CEO') || 
            msg.senderRole.includes('IT Head');

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 transition-all ${
                isCurrentUser ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Sender Avatar */}
              <img
                src={msg.avatar}
                alt={msg.senderName}
                className="w-8 h-8 rounded-xl object-cover shrink-0 border border-purple-400/40 mt-1 shadow-sm"
              />

              {/* Message Bubble Container */}
              <div className={`max-w-[82%] space-y-1 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                {/* Sender Title Strip */}
                <div className={`flex items-center gap-1.5 text-[10px] ${isCurrentUser ? 'justify-end' : ''}`}>
                  <span className="font-bold text-white">
                    {msg.senderName}
                  </span>
                  <span
                    className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border"
                    style={{
                      backgroundColor: `${msg.badgeColor || '#8A2BE2'}20`,
                      borderColor: `${msg.badgeColor || '#8A2BE2'}60`,
                      color: msg.badgeColor || '#c084fc',
                    }}
                  >
                    {getRoleIcon(msg.senderRole)}
                    <span>{msg.senderRole}</span>
                  </span>
                  <span className="text-slate-500 font-mono-num">{msg.timestamp}</span>
                </div>

                {/* Bubble Text */}
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.isDoubt
                      ? 'bg-amber-950/40 border border-amber-500/50 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : isLeadership
                      ? 'glass-panel-red border border-[#FF0055]/40 text-slate-100 shadow-[0_0_15px_rgba(255,0,85,0.15)]'
                      : isCurrentUser
                      ? 'bg-gradient-to-r from-purple-900/80 to-[#FF0055]/80 border border-purple-400/40 text-white shadow-md'
                      : 'glass-panel border border-purple-500/20 text-slate-200'
                  }`}
                >
                  {msg.isDoubt && (
                    <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-amber-400 mb-1">
                      <HelpCircle className="w-3 h-3" />
                      <span>Academic Doubt / Question Discussion</span>
                    </div>
                  )}
                  <p>{msg.text}</p>
                </div>

                {/* Emoji Reactions Bar */}
                <div className={`flex items-center gap-1 flex-wrap pt-0.5 ${isCurrentUser ? 'justify-end' : ''}`}>
                  {msg.reactions &&
                    Object.entries(msg.reactions).map(([emoji, count]) => (
                      <button
                        key={emoji}
                        onClick={() => handleAddReaction(msg.id, emoji)}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-purple-950/60 border border-purple-500/25 text-[10px] text-slate-300 hover:text-white hover:border-[#FF0055] transition-colors cursor-pointer"
                      >
                        <span>{emoji}</span>
                        <span className="font-mono-num font-bold">{count}</span>
                      </button>
                    ))}

                  {/* Add reaction trigger */}
                  <div className="flex items-center gap-0.5 text-slate-500">
                    {['🔥', '💡', '🎯'].map((e) => (
                      <button
                        key={e}
                        onClick={() => handleAddReaction(msg.id, e)}
                        className="px-1 py-0.5 rounded text-[10px] hover:scale-125 transition-transform cursor-pointer"
                        title={`React with ${e}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-3 py-1.5 overflow-x-auto flex items-center gap-1.5 shrink-0 bg-[#0d021a]/70 border-t border-purple-500/15">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          Quick:
        </span>
        {[
          'What is the -0.25 elimination formula?',
          'Tips for tonight’s Live Grand Quiz? ⚡',
          'Help with Question 2 physics rationale! ❓',
          'Good luck everyone for the Top 5 sprint! 🔥',
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(prompt)}
            className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-purple-950/50 border border-purple-500/20 text-purple-200 hover:text-white hover:border-[#FF0055] whitespace-nowrap transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <div className="p-3 bg-[#0a0115]/95 backdrop-blur-xl border-t border-purple-500/25 shrink-0">
        <form onSubmit={handleSendMessage} className="space-y-2">
          {/* Ask a Doubt Toggle */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setIsDoubtMode(!isDoubtMode);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                isDoubtMode
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_#f59e0b]'
                  : 'bg-purple-950/40 text-slate-400 hover:text-white border border-purple-500/20'
              }`}
            >
              <HelpCircle className="w-3 h-3" />
              <span>{isDoubtMode ? 'Academic Doubt Mode (ON)' : 'Tag as Doubt'}</span>
            </button>

            {!currentUser && (
              <span className="text-[10px] text-purple-300">
                Sign in to send messages as a member
              </span>
            )}
          </div>

          <div className="relative flex items-center gap-2">
            <input
              type="text"
              placeholder={
                isDoubtMode
                  ? 'Ask your question or doubt here for the community...'
                  : 'Type a message in the QP Community Commons...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white shadow-[0_0_15px_rgba(255,0,85,0.4)] hover:shadow-[0_0_20px_rgba(255,0,85,0.7)] active:scale-95 transition-all cursor-pointer disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

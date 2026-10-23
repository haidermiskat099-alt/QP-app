import React from 'react';
import { Bell, X, AlertTriangle, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { BroadcastAnnouncement } from '../types';
import { sounds } from '../utils/audio';

interface BroadcastToastProps {
  announcement: BroadcastAnnouncement | null;
  onDismiss: () => void;
  onOpenHistory: () => void;
}

export const BroadcastNotificationToast: React.FC<BroadcastToastProps> = ({
  announcement,
  onDismiss,
  onOpenHistory,
}) => {
  if (!announcement) return null;

  return (
    <div className="absolute top-2 left-3 right-3 z-50 animate-slideDown">
      <div 
        onClick={() => {
          sounds.playTap();
          onOpenHistory();
        }}
        className="w-full p-3.5 rounded-2xl glass-panel-red border border-[#FF0055]/50 shadow-[0_0_25px_rgba(255,0,85,0.4)] cursor-pointer hover:border-[#FF0055] transition-all"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF0055] flex items-center justify-center shrink-0 shadow-[0_0_12px_#FF0055]">
              <Bell className="w-4 h-4 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF0055] bg-red-950/60 px-2 py-0.5 rounded-md border border-[#FF0055]/40">
                  Broadcast Alert
                </span>
                <span className="text-[10px] text-slate-400 font-mono-num">{announcement.createdAt}</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1 leading-tight">
                {announcement.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                {announcement.message}
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-purple-300">
                <Sparkles className="w-3 h-3 text-[#FF0055]" />
                <span>Issued by {announcement.authorName} ({announcement.authorRole})</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              sounds.playTap();
              onDismiss();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Dismiss Notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface BroadcastDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: BroadcastAnnouncement[];
}

export const BroadcastDrawerModal: React.FC<BroadcastDrawerModalProps> = ({
  isOpen,
  onClose,
  announcements,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md h-[80vh] sm:h-[650px] rounded-t-[32px] sm:rounded-3xl glass-panel-glow border border-purple-500/30 overflow-hidden flex flex-col shadow-[0_0_40px_rgba(138,43,226,0.3)]">
        {/* Grab Handle for mobile */}
        <div className="w-12 h-1 bg-purple-500/30 rounded-full mx-auto my-3 shrink-0" />

        {/* Header */}
        <div className="px-6 py-2 pb-4 flex items-center justify-between border-b border-purple-500/20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF0055] to-[#8A2BE2] flex items-center justify-center shadow-[0_0_10px_rgba(255,0,85,0.5)]">
              <Bell className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Broadcast Center</h3>
              <p className="text-[11px] text-purple-300/80">Direct administrative notices & live quiz sirens</p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-purple-950/60 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Announcements */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {announcements.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No broadcast announcements issued yet.
            </div>
          ) : (
            announcements.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl glass-panel border border-purple-500/20 hover:border-[#FF0055]/40 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF0055] bg-red-950/50 px-2 py-0.5 rounded border border-[#FF0055]/30">
                    {item.urgency === 'live_event' ? 'Live Quiz Siren' : 'Official Notice'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono-num">{item.createdAt}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>
                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-purple-500/15 text-[11px] text-purple-300 font-medium">
                  <div className="w-2 h-2 rounded-full bg-[#FF0055] shadow-[0_0_6px_#FF0055]" />
                  <span>{item.authorName}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{item.authorRole}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

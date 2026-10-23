import React, { useState } from 'react';
import { 
  Play, 
  Youtube, 
  BookOpen, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Search,
  ExternalLink
} from 'lucide-react';
import { EducationalVideo } from '../types';
import { INITIAL_EDUCATIONAL_VIDEOS } from '../data/initialData';
import { sounds } from '../utils/audio';

interface YouTubeEducationalCornerProps {
  onStartQuizOnTopic?: (category: string) => void;
}

export const YouTubeEducationalCorner: React.FC<YouTubeEducationalCornerProps> = ({
  onStartQuizOnTopic,
}) => {
  const [videos] = useState<EducationalVideo[]>(INITIAL_EDUCATIONAL_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<EducationalVideo>(videos[0]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['yt_1']);

  const categories = ['All', 'General Science & BCS', 'Medical Admission', 'Engineering Admission', 'Exam Strategy'];

  const filteredVideos = videos.filter((v) => {
    const matchesCategory = activeCategory === 'All' || v.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playTap();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectVideo = (video: EducationalVideo) => {
    sounds.playTap();
    setSelectedVideo(video);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/70 border border-[#FF0055]/50 text-[#FF0055] text-[11px] font-bold uppercase tracking-wider mb-1">
            <Youtube className="w-3.5 h-3.5" />
            <span>In-App Educational Corner</span>
          </div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-white">
            Curated High-Yield Lectures
          </h2>
          <p className="text-xs text-purple-200">
            Stream authoritative video tutorials & connect concepts directly to timed drills
          </p>
        </div>
      </div>

      {/* Featured Video Player Box (Responsive Embedded YouTube Player) */}
      <div className="rounded-3xl glass-panel-glow border border-purple-500/35 overflow-hidden shadow-[0_0_35px_rgba(255,0,85,0.25)] space-y-3 p-3 sm:p-4">
        {/* 16:9 Aspect Ratio Responsive YouTube Embed */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-purple-500/30 shadow-inner">
          <iframe
            src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?rel=0&modestbranding=1&enablejsapi=1`}
            title={selectedVideo.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Info Strip */}
        <div className="space-y-2 pt-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-red-950/60 text-[#FF0055] border border-[#FF0055]/40">
                  {selectedVideo.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono-num flex items-center gap-1">
                  <Clock className="w-3 h-3 text-purple-400" />
                  {selectedVideo.duration}
                </span>
                <span className="text-[10px] text-slate-400 font-mono-num flex items-center gap-1">
                  <Eye className="w-3 h-3 text-slate-500" />
                  {selectedVideo.views}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                {selectedVideo.title}
              </h3>
              <p className="text-xs text-purple-300 font-medium mt-0.5">
                Instructor: {selectedVideo.instructor}
              </p>
            </div>

            <button
              onClick={(e) => toggleBookmark(selectedVideo.id, e)}
              className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Bookmark lecture"
            >
              {bookmarkedIds.includes(selectedVideo.id) ? (
                <BookmarkCheck className="w-4 h-4 text-[#FF0055]" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedVideo.summary}
          </p>

          {/* Key Learning Takeaways */}
          <div className="p-3 rounded-2xl bg-[#0e021a]/80 border border-purple-500/20 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Core Examination Rationale Taught in This Video:</span>
            </span>
            <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-300">
              {selectedVideo.keyPoints.map((pt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct CTA: Practice MCQs on this lecture */}
          {onStartQuizOnTopic && selectedVideo.associatedQuizCategory && (
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-purple-200">
                Ready to test what you learned?
              </span>
              <button
                onClick={() => {
                  sounds.playTap();
                  onStartQuizOnTopic(selectedVideo.associatedQuizCategory!);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white text-xs font-bold shadow-[0_0_12px_rgba(255,0,85,0.4)] hover:shadow-[0_0_18px_rgba(255,0,85,0.7)] transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Take Practice Quiz</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search and Category Filter Strip */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Search educational lectures by topic, formula, or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
          />
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sounds.playTap();
                setActiveCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#FF0055] to-[#8A2BE2] text-white shadow-[0_0_10px_rgba(255,0,85,0.4)]'
                  : 'bg-purple-950/40 text-slate-400 hover:text-white border border-purple-500/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Playlist Cards */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] to-purple-300">
          Curated Lecture Archive ({filteredVideos.length})
        </h4>

        <div className="space-y-2">
          {filteredVideos.map((vid) => {
            const isPlaying = selectedVideo.id === vid.id;
            return (
              <div
                key={vid.id}
                onClick={() => handleSelectVideo(vid)}
                className={`p-3 rounded-2xl glass-panel border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isPlaying
                    ? 'border-[#FF0055] bg-red-950/30 shadow-[0_0_20px_rgba(255,0,85,0.2)]'
                    : 'border-purple-500/20 hover:border-purple-400/50 hover:bg-purple-950/30'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-20 h-13 rounded-xl overflow-hidden bg-black shrink-0 border border-purple-500/30">
                    <img
                      src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                      alt={vid.title}
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-6 h-6 rounded-full bg-[#FF0055] text-white flex items-center justify-center shadow-[0_0_8px_#FF0055]">
                        <Play className="w-3 h-3 fill-white ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 px-1 rounded text-[8px] font-mono bg-black/80 text-white font-semibold">
                      {vid.duration}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <span className="text-[9px] font-semibold text-purple-300 uppercase">
                      {vid.category}
                    </span>
                    <h5 className="text-xs font-bold text-white truncate leading-snug">
                      {vid.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{vid.instructor}</span>
                      <span>·</span>
                      <span>{vid.views}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  <button
                    onClick={(e) => toggleBookmark(vid.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                  >
                    {bookmarkedIds.includes(vid.id) ? (
                      <BookmarkCheck className="w-4 h-4 text-[#FF0055]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

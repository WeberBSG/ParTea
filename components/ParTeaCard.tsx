
import React from 'react';
import { ParTeaPost } from '../types';

interface ParTeaCardProps {
  post: ParTeaPost;
}

const ParTeaCard: React.FC<ParTeaCardProps> = ({ post }) => {
  const handleShare = async () => {
    // Basic share data structure
    const shareData: ShareData = {
      title: post.title,
      text: post.description,
    };

    // Helper to fallback to clipboard if share fails or is unsupported
    const copyToClipboard = () => {
      const textToCopy = `${post.title}\n${post.description}\n${post.location.uri || ''}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert("Info copied to clipboard!");
      }).catch(() => {
        alert("Sharing is not supported on this device.");
      });
    };

    if (navigator.share) {
      // The Web Share API requires an absolute URL with a supported protocol (usually http or https).
      // We normalize the candidate URL using the URL constructor.
      let shareUrlCandidate = post.location.uri || window.location.href;
      
      try {
        // Attempt to create a valid absolute URL object
        const validatedUrl = new URL(shareUrlCandidate, window.location.origin);
        
        // Only include the URL if it's using a protocol supported by most sharing targets
        if (validatedUrl.protocol === 'http:' || validatedUrl.protocol === 'https:') {
          shareData.url = validatedUrl.href;
        }
        
        await navigator.share(shareData);
      } catch (error) {
        // Handle common errors like user cancellation or invalid URLs gracefully
        if (error instanceof Error && error.name !== 'AbortError') {
          console.warn('Web Share failed, attempting clipboard fallback:', error.message);
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="flex flex-col bg-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-6 border border-slate-700">
      {/* Photo */}
      <div className="relative h-[300px] w-full">
        <img 
          src={post.photoUrl} 
          alt={post.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-[10px] font-bold">
            {(post.username || 'P')[0].toUpperCase()}
          </div>
          <span className="text-xs font-medium text-white">@{post.username || 'anonymous'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-white leading-tight">{post.title}</h3>
          <button 
            onClick={handleShare}
            className="p-2 bg-slate-700 hover:bg-pink-500 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            aria-label="Share this ParTea"
          >
            <i className="fa-solid fa-share-nodes text-xs text-white"></i>
          </button>
        </div>

        <p className="text-slate-300 text-sm line-clamp-2">
          {post.description}
        </p>

        <div className="flex items-center gap-2 text-slate-400">
          <i className="fa-solid fa-location-dot text-pink-500" aria-hidden="true"></i>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-200">{post.location.name}</span>
            <span className="text-[10px] opacity-70">
              {post.location.latitude.toFixed(4)}, {post.location.longitude.toFixed(4)}
            </span>
          </div>
        </div>

        {post.location.uri && (
          <a 
            href={post.location.uri} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 text-center text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl hover:opacity-90 transition-opacity active:scale-95"
          >
            Open in Maps
          </a>
        )}
      </div>
    </div>
  );
};

export default ParTeaCard;

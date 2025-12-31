
import React, { useState, useRef } from 'react';
import { User, ParTeaPost, Socials } from '../types';
import ParTeaCard from './ParTeaCard';

interface ProfileProps {
  user: User;
  userPosts: ParTeaPost[];
  onBack: () => void;
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, userPosts, onBack, onLogout, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhoto, setEditPhoto] = useState(user.photo);
  const [editSocials, setEditSocials] = useState<Socials>(user.socials || {});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name: editName,
      photo: editPhoto,
      socials: editSocials,
    });
    setIsEditing(false);
  };

  const username = user.name.replace(/\s+/g, '').toLowerCase();

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={isEditing ? () => setIsEditing(false) : onBack}
          className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl border border-slate-700 text-white"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Profile' : 'Your Profile'}</h2>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl border border-slate-700 text-pink-500"
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        ) : (
          <button 
            onClick={handleSave}
            className="w-10 h-10 flex items-center justify-center bg-pink-500 rounded-xl text-white shadow-lg shadow-pink-500/20"
          >
            <i className="fa-solid fa-check"></i>
          </button>
        )}
      </div>

      {/* User Info Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4 group">
            <div className="absolute -inset-1 bg-pink-500 rounded-full blur opacity-25"></div>
            <img 
              src={isEditing ? editPhoto : user.photo} 
              alt={user.name} 
              className="relative w-24 h-24 rounded-full border-2 border-pink-500 object-cover shadow-lg"
            />
            {isEditing && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <i className="fa-solid fa-camera text-xl"></i>
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>

          {isEditing ? (
            <div className="w-full flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] uppercase font-bold text-slate-500 px-1">Display Name</label>
                <input 
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:ring-1 focus:ring-pink-500 outline-none"
                  placeholder="Your Name"
                />
              </div>
              
              <div className="flex flex-col gap-2 text-left">
                <label className="text-[10px] uppercase font-bold text-slate-500 px-1">Social Media</label>
                <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2">
                  <i className="fa-brands fa-instagram text-pink-500 w-4"></i>
                  <input 
                    type="text" 
                    placeholder="Instagram Username"
                    value={editSocials.instagram || ''}
                    onChange={(e) => setEditSocials({...editSocials, instagram: e.target.value})}
                    className="bg-transparent text-sm text-white outline-none w-full"
                  />
                </div>
                <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2">
                  <i className="fa-brands fa-tiktok text-slate-200 w-4"></i>
                  <input 
                    type="text" 
                    placeholder="TikTok Username"
                    value={editSocials.tiktok || ''}
                    onChange={(e) => setEditSocials({...editSocials, tiktok: e.target.value})}
                    className="bg-transparent text-sm text-white outline-none w-full"
                  />
                </div>
                <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2">
                  <i className="fa-brands fa-facebook text-blue-500 w-4"></i>
                  <input 
                    type="text" 
                    placeholder="Facebook URL"
                    value={editSocials.facebook || ''}
                    onChange={(e) => setEditSocials({...editSocials, facebook: e.target.value})}
                    className="bg-transparent text-sm text-white outline-none w-full"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-white">{user.name}</h3>
              <p className="text-slate-400 text-sm mb-3">@{username}</p>
              
              {/* Display Social Icons */}
              <div className="flex gap-4 mb-6">
                {user.socials?.instagram && (
                  <a href={`https://instagram.com/${user.socials.instagram}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors">
                    <i className="fa-brands fa-instagram text-xl"></i>
                  </a>
                )}
                {user.socials?.tiktok && (
                  <a href={`https://tiktok.com/@${user.socials.tiktok}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                    <i className="fa-brands fa-tiktok text-xl"></i>
                  </a>
                )}
                {user.socials?.facebook && (
                  <a href={user.socials.facebook} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors">
                    <i className="fa-brands fa-facebook text-xl"></i>
                  </a>
                )}
              </div>

              <div className="flex gap-4 w-full">
                <div className="flex-1 bg-slate-800/50 rounded-2xl py-3 border border-slate-700/50">
                  <span className="block text-xl font-bold text-white">{userPosts.length}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">ParTeas</span>
                </div>
                <div className="flex-1 bg-slate-800/50 rounded-2xl py-3 border border-slate-700/50">
                  <span className="block text-xl font-bold text-white">12</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Followers</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {!isEditing && (
        <>
          {/* Posts Section */}
          <div className="flex flex-col gap-4 pb-24">
            <div className="flex items-center justify-between px-1 mb-2">
              <h4 className="text-lg font-bold text-white">Your Posts</h4>
              <span className="text-xs text-pink-500 font-bold">View All</span>
            </div>
            
            {userPosts.length === 0 ? (
              <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-3xl py-12 text-center">
                <p className="text-slate-500 text-sm">You haven't posted any ParTeas yet.</p>
              </div>
            ) : (
              userPosts.map(post => (
                <ParTeaCard key={post.id} post={post} />
              ))
            )}
          </div>

          {/* Quick Settings */}
          <div className="mt-4">
            <button 
              onClick={onLogout}
              className="w-full py-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl font-bold text-sm hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout Account
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;

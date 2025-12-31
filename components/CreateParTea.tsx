
import React, { useState, useRef } from 'react';
import { ParTeaPost, User } from '../types';

interface CreateParTeaProps {
  user: User;
  onPostCreated: (post: ParTeaPost) => void;
  onCancel: () => void;
}

const DEFAULT_PARTY_PHOTO = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1080&h=1920';

const CreateParTea: React.FC<CreateParTeaProps> = ({ user, onPostCreated, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const postPhoto = selectedImage || DEFAULT_PARTY_PHOTO;

    // Get location coordinates if possible, otherwise use defaults
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPost: ParTeaPost = {
          id: Date.now().toString(),
          title,
          description,
          location: {
            name: locationName,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          photoUrl: postPhoto,
          username: user.name.replace(/\s+/g, '').toLowerCase(),
          timestamp: Date.now(),
        };
        onPostCreated(newPost);
      },
      () => {
        // Fallback if location fails
        const newPost: ParTeaPost = {
          id: Date.now().toString(),
          title,
          description,
          location: {
            name: locationName,
            latitude: 0,
            longitude: 0,
          },
          photoUrl: postPhoto,
          username: user.name.replace(/\s+/g, '').toLowerCase(),
          timestamp: Date.now(),
        };
        onPostCreated(newPost);
      }
    );
  };

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onCancel}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl border border-slate-700 text-white"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="text-2xl font-bold text-white">Create ParTea</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-8">
        {/* Image Upload Area */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-400 px-1">Cover Photo</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative h-48 w-full bg-slate-800 border-2 border-dashed border-slate-700 rounded-3xl overflow-hidden cursor-pointer group hover:border-pink-500 transition-colors flex flex-col items-center justify-center"
          >
            {selectedImage ? (
              <>
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-bold bg-slate-900/80 px-4 py-2 rounded-full">Change Photo</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-pink-400 transition-colors">
                <i className="fa-solid fa-image text-3xl"></i>
                <span className="text-xs font-medium uppercase tracking-wider">Upload Image</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-400 px-1">Party Title</label>
          <input 
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Midnight Glow Disco"
            className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all placeholder:text-slate-600"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-400 px-1">Location Name</label>
          <input 
            required
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="e.g. The Crystal Ballroom"
            className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all placeholder:text-slate-600"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-400 px-1">Description</label>
          <textarea 
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us what makes this ParTea special..."
            className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all placeholder:text-slate-600 resize-none"
          ></textarea>
        </div>

        <div className="mt-2 flex flex-col gap-3">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold shadow-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-circle-notch animate-spin"></i> Posting...
              </span>
            ) : "Share ParTea"}
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="w-full py-3 bg-transparent text-slate-400 font-medium hover:text-white transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateParTea;

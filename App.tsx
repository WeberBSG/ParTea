
import React, { useState, useEffect, useCallback } from 'react';
import { ParTeaPost, User, ViewState } from './types';
import ParTeaCard from './components/ParTeaCard';
import Menu from './components/Menu';
import CreateParTea from './components/CreateParTea';
import Profile from './components/Profile';
import { searchParties } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<ParTeaPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial mock data
  const initialPosts: ParTeaPost[] = [
    {
      id: '1',
      title: 'Neon Rooftop Party',
      description: 'The best house music under the stars. Free drinks for the first 50 guests!',
      location: { name: 'Sky High Lounge', latitude: 40.7128, longitude: -74.0060 },
      photoUrl: 'https://picsum.photos/seed/p1/1080/1920',
      username: 'partyanimal',
      timestamp: Date.now() - 3600000
    },
    {
      id: '2',
      title: 'Beachside Rave',
      description: 'Electronic beats and ocean breeze. Bring your swimsuit!',
      location: { name: 'Sunset Sands', latitude: 34.0522, longitude: -118.2437 },
      photoUrl: 'https://picsum.photos/seed/p2/1080/1920',
      username: 'beachvibes',
      timestamp: Date.now() - 7200000
    }
  ];

  const handleLogin = () => {
    // Mock login
    const mockUser: User = {
      id: 'u1',
      name: 'Tea Enthusiast',
      email: 'tea@party.com',
      photo: 'https://picsum.photos/seed/user1/100/100',
      socials: {
        instagram: 'partea_official'
      }
    };
    setUser(mockUser);
    setPosts(initialPosts);
    setView('feed');
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
  };

  const handlePostCreated = (newPost: ParTeaPost) => {
    setPosts([newPost, ...posts]);
    setView('feed');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const fetchParties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const result = await searchParties(latitude, longitude);
              if (result.posts.length > 0) {
                setPosts(result.posts);
              } else {
                setPosts(initialPosts);
              }
              setLoading(false);
            } catch (err) {
              setError("Failed to fetch parties from Gemini.");
              setLoading(false);
            }
          },
          (err) => {
            setError("Location access denied. Please enable GPS.");
            setLoading(false);
          }
        );
      } else {
        setError("Geolocation not supported.");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'search') {
      fetchParties();
    }
  }, [view, fetchParties]);

  // Filter posts created by the current user
  const userPosts = user 
    ? posts.filter(p => p.username === user.name.replace(/\s+/g, '').toLowerCase()) 
    : [];

  return (
    <div className="relative w-full h-screen flex justify-center items-center bg-slate-950 p-4 overflow-hidden">
      {/* 9:16 aspect ratio container (Phone Simulation) */}
      <div 
        className="relative bg-slate-900 shadow-[0_0_50px_-12px_rgba(236,72,153,0.3)] border-4 border-slate-800 rounded-[3rem] overflow-hidden"
        style={{ width: 'min(1080px, calc(100vh * 9 / 16))', height: 'min(1920px, 92vh)', aspectRatio: '9/16' }}
      >
        {/* Notch simulation */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-50"></div>

        {/* Header (Always Present) */}
        <header className="absolute top-8 left-6 right-6 z-40 flex justify-between items-center">
          <Menu 
            isLoggedIn={!!user} 
            onLogin={handleLogin} 
            onLogout={handleLogout}
            onNavigate={(v) => setView(v)}
          />
          {view !== 'home' && (
            <div 
              onClick={() => setView('feed')}
              className="text-xl font-black italic tracking-tighter text-white cursor-pointer"
            >
              Par<span className="text-pink-500">Tea</span>
            </div>
          )}
          {view !== 'home' && user && (
            <button 
              onClick={() => setView('profile')}
              className="w-10 h-10 rounded-full border border-pink-500 overflow-hidden shadow-lg hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
            </button>
          )}
        </header>

        {/* View Rendering */}
        <div className="h-full w-full overflow-y-auto px-6 pt-24 pb-12 scrollbar-hide">
          {view === 'home' ? (
            <div className="h-full flex flex-col items-center justify-center gap-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="absolute -inset-4 bg-pink-500 blur-2xl opacity-20 animate-pulse"></div>
                  <i className="fa-solid fa-mug-hot text-8xl text-pink-500 relative drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]"></i>
                  <i className="fa-solid fa-star absolute -top-4 -right-4 text-yellow-400 text-3xl animate-bounce"></i>
                </div>
                <h1 className="text-6xl font-black italic tracking-tighter text-white">
                  Par<span className="text-pink-500">Tea</span>
                </h1>
                <p className="text-slate-400 mt-4 max-w-[250px]">Find the hottest gatherings in your area instantly.</p>
              </div>

              <div className="flex flex-col gap-4 w-full px-8">
                <button 
                  onClick={handleLogin}
                  className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  <i className="fa-brands fa-google text-xl text-pink-500"></i>
                  Login with Google
                </button>
                <button 
                  onClick={handleLogin}
                  className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold border border-slate-700 hover:bg-slate-700 transition-all"
                >
                  Register with Google
                </button>
              </div>
            </div>
          ) : view === 'create' && user ? (
            <CreateParTea 
              user={user} 
              onPostCreated={handlePostCreated} 
              onCancel={() => setView('feed')} 
            />
          ) : view === 'profile' && user ? (
            <Profile 
              user={user} 
              userPosts={userPosts}
              onBack={() => setView('feed')}
              onLogout={handleLogout}
              onUpdateUser={handleUpdateUser}
            />
          ) : (
            <div className="flex flex-col animate-in fade-in duration-500">
              {view === 'search' && (
                <div className="mb-6 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <h2 className="text-lg font-bold mb-1">Searching Nearby...</h2>
                  <p className="text-xs text-slate-400">Using Google Maps grounding to find current events.</p>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
                  <p className="text-slate-400 animate-pulse">Brewing your ParTea list...</p>
                </div>
              ) : error ? (
                <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-2xl text-center">
                  <i className="fa-solid fa-circle-exclamation text-red-500 text-3xl mb-4"></i>
                  <p className="text-red-200 text-sm mb-4">{error}</p>
                  <button 
                    onClick={fetchParties}
                    className="bg-red-500 text-white px-6 py-2 rounded-xl text-xs font-bold"
                  >
                    Retry
                  </button>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-slate-500">No parties found nearby yet. Be the first to host one!</p>
                </div>
              ) : (
                <div className="flex flex-col pb-20">
                  {posts.map((post) => (
                    <ParTeaCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-700 rounded-full opacity-50"></div>
      </div>
    </div>
  );
};

export default App;

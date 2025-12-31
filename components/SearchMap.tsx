
import React, { useEffect, useRef, useState } from 'react';
import { ParTeaPost } from '../types';

// Declare google variable globally as any to fix "Cannot find name 'google'" and "Cannot find namespace 'google'" errors
declare const google: any;

interface SearchMapProps {
  posts: ParTeaPost[];
  userLocation: { lat: number; lng: number } | null;
  onBack: () => void;
}

const SearchMap: React.FC<SearchMapProps> = ({ posts, userLocation, onBack }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  // Changed state type to any to resolve "Cannot find namespace 'google'" error
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    // Casting window to any to avoid "Property 'google' does not exist on type 'Window'" error
    if (!(window as any).google) {
      const script = document.createElement('script');
      // Using process.env.API_KEY as provided in the environment
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY || ''}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!mapRef.current) return;

      // Type any used implicitly for map options as google namespace is declared globally as any
      const mapOptions = {
        center: userLocation || { lat: 0, lng: 0 },
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: false,
        styles: [
          { "featureType": "all", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
          { "featureType": "road", "elementType": "geometry", "stylers": [{ "visibility": "on" }, { "color": "#1e293b" }] },
          { "featureType": "road", "elementType": "labels", "stylers": [{ "visibility": "on" }] },
          { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
          { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] },
          { "featureType": "water", "stylers": [{ "color": "#0f172a" }] },
          { "featureType": "landscape", "stylers": [{ "color": "#020617" }] },
          { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
          { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
          { "featureType": "administrative", "stylers": [{ "visibility": "on" }, { "weight": 0.5 }] },
          { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#475569" }] }
        ]
      };

      // Resolved errors by using the globally declared 'google' variable
      const newMap = new google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
    }
  }, [userLocation]);

  useEffect(() => {
    if (!map) return;

    // Add markers for the current posts using the 'google' global object
    posts.forEach((post) => {
      const marker = new google.maps.Marker({
        position: { lat: post.location.latitude, lng: post.location.longitude },
        map: map,
        title: post.title,
        icon: {
          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
          fillColor: "#ec4899",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff",
          scale: 2,
          anchor: new google.maps.Point(12, 24),
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color: #1e293b; padding: 8px; font-family: sans-serif;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold;">${post.title}</h3>
            <p style="margin: 0; font-size: 12px; color: #64748b;">${post.location.name}</p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    });
  }, [map, posts]);

  return (
    <div className="absolute inset-0 z-0 animate-in fade-in duration-700">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Overlay UI */}
      <div className="absolute top-24 left-6 right-6 flex flex-col pointer-events-none">
        <div className="flex justify-between items-center pointer-events-auto">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-700 text-white shadow-xl"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          
          <div className="bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-white uppercase tracking-widest">Live ParTeas</span>
          </div>
        </div>
      </div>

      {/* Bottom Card Preview */}
      <div className="absolute bottom-12 left-6 right-6 pointer-events-none">
        <div className="bg-slate-900/95 backdrop-blur-lg border border-slate-700 p-4 rounded-[2rem] shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center">
              <i className="fa-solid fa-map-location-dot text-pink-500"></i>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Exploring {posts.length} parties</p>
              <p className="text-slate-400 text-xs">Tap markers to view details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchMap;

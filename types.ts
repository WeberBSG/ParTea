
export interface ParTeaLocation {
  name: string;
  latitude: number;
  longitude: number;
  uri?: string;
}

export interface ParTeaPost {
  id: string;
  title: string;
  description: string;
  location: ParTeaLocation;
  photoUrl: string;
  username: string;
  timestamp: number;
}

export interface Socials {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  twitter?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photo: string;
  socials?: Socials;
}

export type ViewState = 'home' | 'feed' | 'search' | 'create' | 'profile';

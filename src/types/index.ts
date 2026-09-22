export interface UserPublic {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  dob: string;
  age: number;
  district: string | null;
  religion: string;
  maritalStatus: string | null;
  phone?: string | null;
  role: string;
  premium: 'Free' | 'Gold' | 'Platinum';
  premiumActivatedAt?: string | null;
  lastActive: string;
  profileComplete: boolean;
  createdAt: string;
  photoUrl?: string | null;
}

export interface ProfileDetails {
  id: string;
  userId: string;
  heightCm?: number | null;
  weightKg?: number | null;
  education?: string | null;
  subject?: string | null;
  occupation?: string | null;
  income?: string | null;
  familyStatus?: string | null;
  fatherOccupation?: string | null;
  motherOccupation?: string | null;
  brothers?: number;
  sisters?: number;
  languages?: string | null;
  introduction?: string | null;
  longBio?: string | null;
  hobbies?: string[];
  favoriteBooks?: string | null;
  favoriteFood?: string | null;
  smoking?: string | null;
  prayerFrequency?: string | null;
  hijabNiqab?: string | null;
  children?: string | null;
  allergies?: string | null;
  healthProblems?: string | null;
  lookingFor?: string | null;
  prefAgeMin?: number | null;
  prefAgeMax?: number | null;
  prefHeight?: string | null;
  prefEducation?: string | null;
  prefDistrict?: string | null;
  workPreference?: string | null;
  updatedAt?: string;
}

export interface ProfileCardData {
  id: string;
  userId: string;
  name: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  age: number;
  district: string | null;
  religion: string;
  maritalStatus: string | null;
  occupation: string | null;
  education: string | null;
  heightCm: number | null;
  introduction: string | null;
  prayerFrequency: string | null;
  hijabNiqab: string | null;
  premium: 'Free' | 'Gold' | 'Platinum';
  profileComplete: boolean;
  lastActive: string;
  active: boolean;
  photoIds: string[];
  photos: string[]; // URLs or photo IDs
  favorited?: boolean;
  matchScore?: number;
}

export interface ConversationSummary {
  id: string;
  other: {
    id: string;
    name: string;
    gender: 'Male' | 'Female';
    district: string | null;
    premium: 'Free' | 'Gold' | 'Platinum';
    lastActive: string;
    active?: boolean;
    photoId?: string | null;
    photoUrl?: string | null;
  };
  lastMessage: {
    text: string;
    at: string;
    fromMe: boolean;
  } | null;
  lastMessageAt: string;
  unread: number;
}

export interface MessageItem {
  id: string;
  from: string;
  text: string;
  at: string;
  readAt?: string | null;
}

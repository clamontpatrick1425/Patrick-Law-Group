
export interface Message {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  groundingMetadata?: {
    groundingChunks: {
      web?: {
        uri: string;
        title: string;
      };
    }[];
  };
}

export enum PracticeArea {
  BUSINESS = 'Business Law',
  CORPORATE = 'Corporate Law',
  IP = 'Intellectual Property',
  INJURY = 'Personal Injury',
}

export interface Attorney {
  id: string;
  name: string;
  role: string;
  bio: string; // Short bio for card
  fullBio: string[]; // Paragraphs
  imageUrl: string;
  practiceAreas: string[];
  education: string[];
  email: string;
  phone: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  location: string;
}

export interface CaseResult {
  id: string;
  title: string;
  practiceArea: string;
  description: string;
  outcome: string;
  amount?: string;
  // New detailed fields
  challenge: string;
  strategy: string;
  duration: string;
}

export interface LiveConnectionState {
  isConnected: boolean;
  isListening: boolean;
  error: string | null;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}

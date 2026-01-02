
export enum AppMode {
  CHAT = 'CHAT',
  IMAGES = 'IMAGES',
  GROUNDING = 'GROUNDING'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  groundingSources?: GroundingSource[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

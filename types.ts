
export interface Scene {
  sceneNumber: number;
  visualPrompt: string;
}

export interface StoryboardImage {
  scene: Scene;
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum Tab {
  GENERATOR = 'generator',
  CHATBOT = 'chatbot',
}

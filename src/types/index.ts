export interface Message {
  role: 'user' | 'assistant';
  content: any;
  hasWidget?: boolean; // This flag is crucial for the "Go to Workspace" button
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  widgets: CanvasWidget[];
}

export type UserRole = 'Recruiter' | 'HR Manager' | 'Compliance Officer';

export interface CanvasWidget {
  id: string;
  type: 'chart' | 'table' | 'text' | 'metric' | 'insight' | 'comparison';
  title: string;
  data: any;
  query: string;
  timestamp: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export type CanvasLayout = 'grid'; // Simplified for now
export type UserRole = 'Recruiter' | 'HR Manager' | 'Compliance Officer';

export interface CanvasWidget {
  id: string;
  type: 'chart' | 'table' | 'text' | 'metric' | 'insight' | 'comparison';
  title: string;
  data: any;
  query: string;
  timestamp?: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  isMinimized?: boolean;
  isExpanded?: boolean;
  relatedWidgets?: string[];
}

// Definition for chart data structures, used by ChartDisplay
export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      [key: string]: any;
    }>;
  };
  options?: any;
}

export type CanvasLayout = 'grid' | 'freeform' | 'split' | 'dashboard';

export interface WidgetConnection {
  from: string;
  to: string;
  relationship: 'comparison' | 'drill_down' | 'related' | 'time_series';
}

export interface Folder {
    id: string;
    name: string;
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    folderId: string | null; // Can be null for chats not in a folder
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

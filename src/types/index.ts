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
  isMinimized?: boolean;
  isExpanded?: boolean;
  relatedWidgets?: string[];
}

export type CanvasLayout = 'grid' | 'freeform' | 'split' | 'dashboard';

export interface WidgetConnection {
  from: string;
  to: string;
  relationship: 'comparison' | 'drill_down' | 'related' | 'time_series';
}
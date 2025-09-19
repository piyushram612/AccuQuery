export interface Candidate {
  candidate_id: string;
  name: string;
  dob: string;
  region: string;
}

export interface Order {
  order_id: string;
  candidate_id: string;
  search_type: 'CRIM' | 'EDU' | 'EMP' | 'MVR' | 'DHS';
  status: 'Draft' | 'Pending' | 'Completed' | 'Discrepancy Found' | 'Dispute';
  start_date: string;
  end_date: string | null;
  turnaround_time?: number; // in days
}

export interface Dispute {
  dispute_id: string;
  order_id: string;
  reason: string;
  resolution_status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
  created_date: string;
  resolved_date?: string;
}

export interface AuditLog {
  id: string;
  query_text: string;
  role: UserRole;
  timestamp: string;
  response_summary: string;
}

export type UserRole = 'Recruiter' | 'HR Manager' | 'Compliance Officer';

export interface QueryResponse {
  type: 'text' | 'table' | 'chart';
  content: any;
  summary: string;
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: any;
  options?: any;
}
import { AuditLog } from '../types';

export const mockAuditLogs: AuditLog[] = [
  // --- Compliance Officer Logs (Focus on risk, disputes, and broad oversight) ---
  {
    id: `LOG_${Date.now() - 10000}`,
    query_text: "List all open disputes older than 7 days.",
    role: 'Compliance Officer',
    timestamp: new Date(Date.now() - 10000).toISOString(),
    response_summary: "Found 2 high-risk disputes open for more than a week. Displayed details in a table."
  },
  {
    id: `LOG_${Date.now() - 86400000 * 2}`,
    query_text: "Show all orders with a 'Discrepancy Found' status in the West region.",
    role: 'Compliance Officer',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    response_summary: "Returned 4 orders with status 'Discrepancy Found' in the specified region."
  },
  {
    id: `LOG_${Date.now() - 86400000 * 4}`,
    query_text: "Generate a report of all background checks for candidates in the financial sector for Q3.",
    role: 'Compliance Officer',
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
    response_summary: "Aggregated data for 58 checks and prepared a downloadable report."
  },

  // --- HR Manager Logs (Focus on trends, efficiency, and analytics) ---
  {
    id: `LOG_${Date.now() - 3600000}`,
    query_text: "What is the average turnaround time for all checks this month?",
    role: 'HR Manager',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    response_summary: "Calculated average TAT as 4.2 days. Displayed a bar chart breakdown by search type."
  },
  {
    id: `LOG_${Date.now() - 86400000 * 3}`,
    query_text: "Show me the order volume trend for the last 6 months.",
    role: 'HR Manager',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    response_summary: "Generated a line chart illustrating monthly order volumes."
  },
   {
    id: `LOG_${Date.now() - 86400000 * 5}`,
    query_text: "Which search type has the highest rate of discrepancies?",
    role: 'HR Manager',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    response_summary: "CRIM checks have the highest discrepancy rate at 8.2%. Displayed a comparison chart."
  },

  // --- Recruiter Logs (Focus on specific candidates and operational status) ---
  {
    id: `LOG_${Date.now() - 7200000}`,
    query_text: "What is the status of the criminal background check for John Smith (C001)?",
    role: 'Recruiter',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    response_summary: "Returned 1 record: Order ORD001 status is 'Completed'."
  },
  {
    id: `LOG_${Date.now() - 86400000}`,
    query_text: "Are there any pending education verifications for candidate Sarah Johnson?",
    role: 'Recruiter',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    response_summary: "No pending education checks found for this candidate."
  },
  {
    id: `LOG_${Date.now() - 86400000 * 6}`,
    query_text: "Find all candidates from the Northeast region with completed checks.",
    role: 'Recruiter',
    timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
    response_summary: "Found 6 candidates. Displayed their names and completed check types in a table."
  }
];
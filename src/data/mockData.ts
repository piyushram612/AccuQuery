import { Candidate, Order, Dispute } from '../types';
import { addDays, subDays, format } from 'date-fns';

// Generate mock candidates
export const candidates: Candidate[] = [
  { candidate_id: 'C001', name: 'John Smith', dob: '1990-05-15', region: 'Northeast' },
  { candidate_id: 'C002', name: 'Sarah Johnson', dob: '1988-12-03', region: 'West' },
  { candidate_id: 'C003', name: 'Michael Brown', dob: '1992-08-22', region: 'Southeast' },
  { candidate_id: 'C004', name: 'Emily Davis', dob: '1989-11-10', region: 'Midwest' },
  { candidate_id: 'C005', name: 'David Wilson', dob: '1991-03-07', region: 'Southwest' },
  { candidate_id: 'C006', name: 'Lisa Anderson', dob: '1987-09-18', region: 'Northeast' },
  { candidate_id: 'C007', name: 'Robert Taylor', dob: '1993-01-25', region: 'West' },
  { candidate_id: 'C008', name: 'Jennifer Martinez', dob: '1990-07-14', region: 'Southeast' },
  { candidate_id: 'C009', name: 'Christopher Lee', dob: '1986-04-30', region: 'Midwest' },
  { candidate_id: 'C010', name: 'Amanda White', dob: '1994-12-08', region: 'Southwest' },
  { candidate_id: 'C011', name: 'James Garcia', dob: '1985-06-12', region: 'Northeast' },
  { candidate_id: 'C012', name: 'Maria Rodriguez', dob: '1991-10-27', region: 'West' },
  { candidate_id: 'C013', name: 'Daniel Thompson', dob: '1989-02-14', region: 'Southeast' },
  { candidate_id: 'C014', name: 'Michelle Clark', dob: '1992-11-03', region: 'Midwest' },
  { candidate_id: 'C015', name: 'Kevin Lewis', dob: '1988-08-17', region: 'Southwest' },
  { candidate_id: 'C016', name: 'Laura Walker', dob: '1990-05-29', region: 'Northeast' },
  { candidate_id: 'C017', name: 'Brian Hall', dob: '1987-01-11', region: 'West' },
  { candidate_id: 'C018', name: 'Nancy Allen', dob: '1993-09-05', region: 'Southeast' },
  { candidate_id: 'C019', name: 'Steven Young', dob: '1991-12-20', region: 'Midwest' },
  { candidate_id: 'C020', name: 'Kimberly King', dob: '1986-07-08', region: 'Southwest' },
];

const searchTypes: Order['search_type'][] = ['CRIM', 'EDU', 'EMP', 'MVR', 'DHS'];
const statuses: Order['status'][] = ['Draft', 'Pending', 'Completed', 'Discrepancy Found', 'Dispute'];

// Generate mock orders
export const orders: Order[] = [];
let orderCounter = 1;

candidates.forEach(candidate => {
  // Generate 3-8 orders per candidate
  const numOrders = Math.floor(Math.random() * 6) + 3;
  
  for (let i = 0; i < numOrders; i++) {
    const searchType = searchTypes[Math.floor(Math.random() * searchTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate start date within last 90 days
    const startDate = subDays(new Date(), Math.floor(Math.random() * 90));
    let endDate: string | null = null;
    let turnaroundTime: number | undefined = undefined;
    
    if (status === 'Completed' || status === 'Discrepancy Found') {
      // Add 1-14 days to start date for completion
      const completionDays = Math.floor(Math.random() * 14) + 1;
      endDate = format(addDays(startDate, completionDays), 'yyyy-MM-dd');
      turnaroundTime = completionDays;
    } else if (status === 'Dispute') {
      // Disputes are completed but with issues
      const completionDays = Math.floor(Math.random() * 10) + 3;
      endDate = format(addDays(startDate, completionDays), 'yyyy-MM-dd');
      turnaroundTime = completionDays;
    }
    
    orders.push({
      order_id: `ORD${orderCounter.toString().padStart(3, '0')}`,
      candidate_id: candidate.candidate_id,
      search_type: searchType,
      status,
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: endDate,
      turnaround_time: turnaroundTime
    });
    
    orderCounter++;
  }
});

// Generate disputes for orders with status 'Dispute'
export const disputes: Dispute[] = orders
  .filter(order => order.status === 'Dispute')
  .map((order, index) => {
    const reasons = [
      'Incomplete criminal record information',
      'Education verification mismatch',
      'Employment dates discrepancy',
      'MVR report contains errors',
      'Identity verification failed'
    ];
    
    const resolutionStatuses: Dispute['resolution_status'][] = ['Open', 'In Progress', 'Resolved', 'Escalated'];
    const createdDate = addDays(new Date(order.end_date!), Math.floor(Math.random() * 5));
    const resolutionStatus = resolutionStatuses[Math.floor(Math.random() * resolutionStatuses.length)];
    
    const dispute: Dispute = {
      dispute_id: `DSP${(index + 1).toString().padStart(3, '0')}`,
      order_id: order.order_id,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      resolution_status: resolutionStatus,
      created_date: format(createdDate, 'yyyy-MM-dd')
    };
    
    if (resolutionStatus === 'Resolved') {
      dispute.resolved_date = format(addDays(createdDate, Math.floor(Math.random() * 7) + 1), 'yyyy-MM-dd');
    }
    
    return dispute;
  });

console.log(`Generated ${candidates.length} candidates, ${orders.length} orders, and ${disputes.length} disputes`);
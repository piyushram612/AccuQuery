import React, { useState, useEffect, useMemo } from 'react';
import { Clock, User, Filter } from 'lucide-react';
import AuditLogger from '@/utils/auditLogger';
import { AuditLog as AuditLogType, UserRole } from '../types';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// A memoized component for individual log entries.
const LogEntry: React.FC<{ log: AuditLogType }> = React.memo(({ log }) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Role-specific colors are kept for semantic distinction.
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'Recruiter':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'HR Manager':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Compliance Officer':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    // The Card component now uses its default theme styles.
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex items-center space-x-3">
          {/* Use theme variable for the icon color */}
          <User className="w-5 h-5 text-muted-foreground" />
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(log.role)}`}>
            {log.role}
          </span>
        </div>
        {/* Use theme variable for the timestamp color */}
        <span className="text-sm text-muted-foreground">
          {formatTimestamp(log.timestamp)}
        </span>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <div>
          {/* Use theme variable for the label color */}
          <span className="text-sm font-medium text-muted-foreground">Query:</span>
          {/* Use theme variable for the primary text color */}
          <p className="text-foreground mt-1">{log.query_text}</p>
        </div>
        <div>
           {/* Use theme variable for the label color */}
          <span className="text-sm font-medium text-muted-foreground">Response:</span>
          {/* Use theme variable for the secondary text color */}
          <p className="text-muted-foreground text-sm mt-1">{log.response_summary}</p>
        </div>
      </CardContent>
    </Card>
  );
});


const AuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogType[]>([]);
  const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');
  const auditLogger = AuditLogger.getInstance();

  useEffect(() => {
    const loadLogs = () => {
      const recentLogs = auditLogger.getRecentLogs(100);
      setLogs(recentLogs);
    };

    loadLogs();
    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, [auditLogger]); // Dependency added for correctness

  const filteredLogs = useMemo(() => {
    if (roleFilter === 'All') {
      return logs;
    }
    return logs.filter(log => log.role === roleFilter);
  }, [logs, roleFilter]);

  return (
    // Use theme variables for the main background and text.
    <div className="h-full flex flex-col bg-background text-foreground">
      {/* Header */}
      {/* Use theme variables for header background and border. */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Use theme variable for the icon color */}
            <Clock className="w-5 h-5 text-muted-foreground" />
            {/* Use theme variable for the text color */}
            <h2 className="text-lg font-semibold text-foreground">Query Audit Log</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Use theme variable for the icon color */}
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select onValueChange={(value: UserRole | 'All') => setRoleFilter(value)} defaultValue="All">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Roles</SelectItem>
                <SelectItem value="Recruiter">Recruiter</SelectItem>
                <SelectItem value="HR Manager">HR Manager</SelectItem>
                <SelectItem value="Compliance Officer">Compliance Officer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Use theme variable for the text color */}
        <div className="mt-2 text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {logs.length} queries
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredLogs.length === 0 ? (
          // Use theme variable for the text color in the empty state
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Clock className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No audit logs found</p>
            <p className="text-sm">Start making queries to see audit logs here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <LogEntry key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
import React, { useState, useEffect, useMemo } from 'react';
import { Clock, User, Filter } from 'lucide-react';
import AuditLogger from '@/utils/auditLogger';
import { AuditLog as AuditLogType, UserRole } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Optimized: A memoized component for individual log entries to prevent
// unnecessary re-renders of the entire list when filtering or polling for new data.
const LogEntry: React.FC<{ log: AuditLogType }> = React.memo(({ log }) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Dark Mode: Added dark mode classes for role badges.
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
    // Optimization: Used Shadcn Card component for consistency.
    // Dark Mode: Added dark classes for background, border, and text.
    <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-gray-400" />
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(log.role)}`}>
            {log.role}
          </span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatTimestamp(log.timestamp)}
        </span>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Query:</span>
          <p className="text-gray-900 dark:text-gray-100 mt-1">{log.query_text}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Response:</span>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{log.response_summary}</p>
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
  }, []); // The auditLogger instance is stable, so no dependency is needed.

  // Optimization: Memoize the filtered logs to avoid re-calculating on every render.
  const filteredLogs = useMemo(() => {
    if (roleFilter === 'All') {
      return logs;
    }
    return logs.filter(log => log.role === roleFilter);
  }, [logs, roleFilter]);

  return (
    // Dark Mode: Added dark classes for the main background.
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      {/* Dark Mode: Added dark classes for header background, border, and text. */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Query Audit Log</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            {/* Optimization: Replaced native select with Shadcn Select component. */}
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
        
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredLogs.length} of {logs.length} queries
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
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
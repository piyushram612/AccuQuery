import React, { useState, useEffect } from 'react';
import { Clock, User, Filter } from 'lucide-react';
import AuditLogger from '../utils/auditLogger';
import { AuditLog as AuditLogType, UserRole } from '../types';

const AuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogType[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogType[]>([]);
  const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');
  const auditLogger = AuditLogger.getInstance();

  useEffect(() => {
    const loadLogs = () => {
      const recentLogs = auditLogger.getRecentLogs(100);
      setLogs(recentLogs);
    };

    loadLogs();
    
    // Poll for new logs every 5 seconds
    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (roleFilter === 'All') {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter(log => log.role === roleFilter));
    }
  }, [logs, roleFilter]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'Recruiter':
        return 'bg-blue-100 text-blue-800';
      case 'HR Manager':
        return 'bg-green-100 text-green-800';
      case 'Compliance Officer':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Query Audit Log</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | 'All')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Roles</option>
              <option value="Recruiter">Recruiter</option>
              <option value="HR Manager">HR Manager</option>
              <option value="Compliance Officer">Compliance Officer</option>
            </select>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          Showing {filteredLogs.length} of {logs.length} queries
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No audit logs found</p>
            <p className="text-sm">Start making queries to see audit logs here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(log.role)}`}>
                      {log.role}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Query:</span>
                    <p className="text-gray-900 mt-1">{log.query_text}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Response:</span>
                    <p className="text-gray-600 text-sm mt-1">{log.response_summary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
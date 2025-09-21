import { AuditLog, UserRole } from '../types';
import { mockAuditLogs } from '../data/mockAuditLogs';

class AuditLogger {
  private static instance: AuditLogger;
  private logs: AuditLog[] = [];

  private constructor() {
    this.loadLogs();
  }

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  log(queryText: string, role: UserRole, responseSummary: string): void {
    const logEntry: AuditLog = {
      id: `LOG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      query_text: queryText,
      role,
      timestamp: new Date().toISOString(),
      response_summary: responseSummary
    };

    this.logs.unshift(logEntry); // Add to beginning for reverse chronological order
    this.saveLogs();
  }

  getLogs(): AuditLog[] {
    return [...this.logs];
  }

  getRecentLogs(count: number = 50): AuditLog[] {
    return this.logs.slice(0, count);
  }

  clearLogs(): void {
    this.logs = [];
    this.saveLogs();
  }

  private saveLogs(): void {
    try {
      localStorage.setItem('accuquery_audit_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to save audit logs:', error);
    }
  }

  private loadLogs(): void {
    try {
      const savedLogs = localStorage.getItem('accuquery_audit_logs');
      if (savedLogs && JSON.parse(savedLogs).length > 0) {
        this.logs = JSON.parse(savedLogs);
      } else {
        // If no logs in storage, load the mock data
        this.logs = mockAuditLogs;
        this.saveLogs(); // Optionally save the mock data to local storage
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      this.logs = mockAuditLogs; // Fallback to mock data on error
    }
  }
}

export default AuditLogger;
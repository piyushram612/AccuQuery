import React from 'react';
import { UserRole } from '../types';
import { Activity, Shield, Users } from 'lucide-react';

interface HeaderProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ selectedRole, onRoleChange, sidebarOpen }) => {
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'Recruiter':
        return <Users className="w-4 h-4" />;
      case 'HR Manager':
        return <Activity className="w-4 h-4" />;
      case 'Compliance Officer':
        return <Shield className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'Recruiter':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'HR Manager':
        return 'bg-green-600 hover:bg-green-700';
      case 'Compliance Officer':
        return 'bg-orange-600 hover:bg-orange-700';
    }
  };

  return (
    <header className={`bg-white border-b border-gray-200 px-6 py-4 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AQ</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AccuQuery AI</h1>
              <p className="text-xs text-gray-600">Conversational Intelligence Platform</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Role:</span>
          <div className="flex space-x-2">
            {(['Recruiter', 'HR Manager', 'Compliance Officer'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
                  selectedRole === role
                    ? getRoleColor(role)
                    : 'bg-gray-400 hover:bg-gray-500'
                }`}
              >
                {getRoleIcon(role)}
                <span>{role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
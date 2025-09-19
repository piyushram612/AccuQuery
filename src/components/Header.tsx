import React from 'react';
import { UserRole } from '../types';
import { Activity, Shield, Users, ChevronsUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from './ThemeToggle'; // Import the toggle

interface HeaderProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ selectedRole, onRoleChange, sidebarOpen, onSidebarToggle }) => {
  const roles: { value: UserRole; label: string; icon: React.ReactNode }[] = [
    { value: 'Recruiter', label: 'Recruiter', icon: <Users className="w-4 h-4 mr-2" /> },
    { value: 'HR Manager', label: 'HR Manager', icon: <Activity className="w-4 h-4 mr-2" /> },
    { value: 'Compliance Officer', label: 'Compliance Officer', icon: <Shield className="w-4 h-4 mr-2" /> },
  ];

  const selectedRoleData = roles.find(r => r.value === selectedRole);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onSidebarToggle} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AQ</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">AccuQuery AI</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Conversational Intelligence Platform</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Role:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-between">
                <div className="flex items-center">
                  {selectedRoleData?.icon}
                  {selectedRoleData?.label}
                </div>
                <ChevronsUpDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              {roles.map((role) => (
                <DropdownMenuItem key={role.value} onClick={() => onRoleChange(role.value)}>
                  {role.icon}
                  <span>{role.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle /> {/* Add the toggle here */}
        </div>
      </div>
    </header>
  );
};

export default Header;
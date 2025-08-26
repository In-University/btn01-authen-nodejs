import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const handleLogout = () => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn đăng xuất?');
    if (confirmed) {
      toast.success('Đăng xuất thành công!');
      authAPI.logout();
    }
  };

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('jwtToken');

  if (!isLoggedIn) {
    return null;
  }

  return (
    <header className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">EchoEnglish</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

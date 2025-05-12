
import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  BarChart,
  BookOpen,
  MessageSquare,
  User,
  Settings,
  Trophy,
  MessageCircle,
  AlertCircle,
  Menu,
  X
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

type SidebarProps = {
  children: ReactNode;
};

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const SidebarLayout = ({ children }: SidebarProps) => {
  const { currentUser, logout, role } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  // Define sidebar items based on user role
  const getSidebarItems = (): SidebarItem[] => {
    const basePath = `/${role}-dashboard`;
    
    const baseItems = [
      { icon: BarChart, label: 'Dashboard', href: `${basePath}` },
      { icon: Calendar, label: 'Timetable', href: `${basePath}/timetable` },
      { icon: BookOpen, label: 'Syllabus', href: `${basePath}/syllabus` },
      { icon: Trophy, label: 'Competitions', href: `${basePath}/competitions` },
      { icon: AlertCircle, label: 'Black Marks', href: `${basePath}/black-marks` },
      { icon: MessageSquare, label: 'Feedback', href: `${basePath}/feedback` },
      { icon: MessageCircle, label: 'Chat', href: `${basePath}/chat` },
    ];
    
    // Add role-specific items
    if (role === 'admin') {
      baseItems.push({ icon: Settings, label: 'Admin Controls', href: `${basePath}/admin-controls` });
    }
    
    if (role === 'student') {
      // Additional student-specific items could be added here
    }
    
    if (role === 'faculty') {
      baseItems.push({ icon: User, label: 'Students', href: `${basePath}/students` });
    }
    
    return baseItems;
  };

  const sidebarItems = getSidebarItems();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed z-30 top-4 left-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          className="rounded-full shadow-md bg-white"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 flex-shrink-0 flex flex-col bg-white shadow-lg border-r transition-transform duration-300 ease-in-out",
          isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        {/* Logo and branding */}
        <div className="flex items-center justify-center h-16 px-4">
          <h2 className="text-xl font-bold text-primary">Smart College Mentor</h2>
        </div>
        
        <Separator />

        {/* User profile */}
        <div className="flex items-center gap-3 p-4">
          <Avatar>
            <AvatarImage src={currentUser?.profileImage} />
            <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="font-medium truncate">{currentUser?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{role} Portal</p>
          </div>
        </div>

        <Separator />

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarItems.map((item) => (
            <Link 
              key={item.href}
              to={item.href}
              onClick={() => isMobile && setIsSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                location.pathname === item.href 
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout button */}
        <div className="p-3">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={logout}
          >
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div 
        className={cn(
          "flex-1 overflow-y-auto transition-all duration-300 ease-in-out",
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        )}
      >
        {/* Overlay for mobile */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-10"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Page content */}
        <div className="container mx-auto p-4 min-h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;

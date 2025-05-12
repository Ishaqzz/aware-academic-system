
import { useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMediaQuery } from '@/hooks/use-mobile';
import {
  AlertCircle,
  BarChart3,
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Compass,
  Menu,
  MessageSquare,
  Settings,
  Trophy,
  User,
  BookOpen,
  LogOut,
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { cn } from '@/lib/utils';
import DarkModeToggle from './DarkModeToggle';

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const { currentUser, role, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Define role-specific navigation items
  const navigationItems = [
    {
      title: 'Dashboard',
      icon: <BarChart3 className="h-5 w-5" />,
      href: role === 'student' ? '/student-dashboard' : 
            role === 'faculty' ? '/faculty-dashboard' : 
            role === 'admin' ? '/admin-dashboard' : '/',
      roles: ['student', 'faculty', 'admin']
    },
    {
      title: 'Black Marks',
      icon: <AlertCircle className="h-5 w-5" />,
      href: `/${role}-dashboard/black-marks`,
      roles: ['student', 'faculty', 'admin']
    },
    {
      title: 'Timetable',
      icon: <Calendar className="h-5 w-5" />,
      href: `/${role}-dashboard/timetable`,
      roles: ['student', 'faculty', 'admin']
    },
    {
      title: 'Syllabus',
      icon: <BookOpen className="h-5 w-5" />,
      href: `/${role}-dashboard/syllabus`,
      roles: ['student', 'faculty', 'admin']
    },
    {
      title: 'Competitions',
      icon: <Trophy className="h-5 w-5" />,
      href: `/${role}-dashboard/competitions`,
      roles: ['student', 'faculty', 'admin']
    },
    {
      title: 'Grades',
      icon: <Compass className="h-5 w-5" />,
      href: `/${role}-dashboard/grades`,
      roles: ['student']
    },
    {
      title: 'Feedback',
      icon: <MessageSquare className="h-5 w-5" />,
      href: `/${role}-dashboard/feedback`,
      roles: ['student', 'faculty', 'admin']
    },
    {
      title: 'Chat',
      icon: <MessageSquare className="h-5 w-5" />,
      href: `/${role}-dashboard/chat`,
      roles: ['student', 'faculty']
    }
  ].filter(item => item.roles.includes(role || ''));

  // Filter navigation items based on user role
  const filteredNavigation = navigationItems.filter(
    item => item.roles.includes(role || '')
  );

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const userInitials = currentUser?.name 
    ? `${currentUser.name.split(' ')[0][0]}${currentUser.name.split(' ')[1]?.[0] || ''}` 
    : 'U';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 z-20 hidden flex-col border-r bg-background md:flex",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-between p-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Academic System</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-2 gap-1">
            {filteredNavigation.map((item, index) => (
              <Button
                key={index}
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "flex justify-start",
                  sidebarCollapsed ? "justify-center px-2" : "px-3"
                )}
                onClick={() => handleNavigation(item.href)}
              >
                {item.icon}
                {!sidebarCollapsed && (
                  <span className="ml-2">{item.title}</span>
                )}
              </Button>
            ))}
          </nav>
        </div>
        
        <div className={cn(
          "border-t p-4",
          sidebarCollapsed ? "flex justify-center" : ""
        )}>
          {sidebarCollapsed ? (
            <Avatar onClick={() => navigate(`/${role}-dashboard/settings`)}>
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar onClick={() => navigate(`/${role}-dashboard/settings`)}>
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{currentUser?.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{role}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <DarkModeToggle />
                <Button variant="ghost" size="icon" onClick={signOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet>
          <div className="flex h-16 items-center border-b px-4 md:hidden">
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <div className="flex items-center gap-2 ml-4">
              <AlertCircle className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Academic System</span>
            </div>
            
            <div className="ml-auto flex items-center gap-2">
              <DarkModeToggle />
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8" onClick={() => navigate(`/${role}-dashboard/settings`)}>
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex items-center gap-2 p-4 border-b">
              <AlertCircle className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Academic System</span>
            </div>
            
            <nav className="grid items-start px-2 py-4 gap-1">
              {filteredNavigation.map((item, index) => (
                <Button
                  key={index}
                  variant={location.pathname === item.href ? "secondary" : "ghost"}
                  className="flex justify-start px-3"
                  onClick={() => handleNavigation(item.href)}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </Button>
              ))}
            </nav>
            
            <div className="border-t p-4 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar onClick={() => navigate(`/${role}-dashboard/settings`)}>
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{currentUser?.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{role}</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={signOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      {/* Main Content */}
      <div 
        className={cn(
          "flex flex-1 flex-col overflow-auto pb-10",
          isMobile ? "pt-16" : "",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        <main className="container py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;

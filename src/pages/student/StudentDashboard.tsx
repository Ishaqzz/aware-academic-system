
import React, { useState } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  Calendar, 
  Clock, 
  AlertCircle,
  MessageSquare,
  Trophy,
  BarChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '@/components/SidebarLayout';
import DashboardCard from '@/components/DashboardCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  mockCourses,
  mockEvents,
  mockCompetitions,
  getUserBlackMarks,
  getUserBlackMarkPoints,
  calculateAttendanceRate,
  calculateAverageGrade,
  getSyllabusCompletionRate
} from '@/services/mockData';
import { format } from 'date-fns';
import ChatBot from '@/components/ChatBot';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const userId = currentUser?.id || '';

  const blackMarks = getUserBlackMarks(userId);
  const totalBlackMarkPoints = getUserBlackMarkPoints(userId);
  const attendanceRate = calculateAttendanceRate(userId);
  const averageGrade = calculateAverageGrade(userId);
  
  // Get upcoming events
  const today = new Date();
  const upcomingEvents = mockEvents
    .filter(event => new Date(event.startDate) > today)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);
  
  // Get upcoming competitions
  const upcomingCompetitions = mockCompetitions
    .filter(comp => new Date(comp.date) > today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2);

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {currentUser?.name}</h1>
          <p className="text-muted-foreground">Here's an overview of your academic status and activities</p>
        </div>

        <Separator />

        {/* Status Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard 
            title="Attendance Rate" 
            icon={<Clock className="h-5 w-5" />}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">{attendanceRate.toFixed(1)}%</span>
                <span className="text-sm text-muted-foreground">This Semester</span>
              </div>
              <Progress value={attendanceRate} className="h-2" />
            </div>
          </DashboardCard>

          <DashboardCard 
            title="Average Grade" 
            icon={<BarChart3 className="h-5 w-5" />}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">{averageGrade.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">Out of 100</span>
              </div>
              <Progress value={averageGrade} className="h-2" />
            </div>
          </DashboardCard>

          <DashboardCard 
            title="Black Marks" 
            icon={<AlertCircle className="h-5 w-5" />}
            className={totalBlackMarkPoints > 7 ? "border-amber-200 bg-amber-50" : ""}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">{totalBlackMarkPoints}</span>
                <span className="text-sm text-muted-foreground">Points ({blackMarks.length} marks)</span>
              </div>
              <Progress value={(totalBlackMarkPoints / 15) * 100} className="h-2" />
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>Safe</span>
                <span>Warning</span>
                <span>Critical</span>
              </div>
              <Button 
                variant="link" 
                className="px-0 h-auto" 
                onClick={() => navigate('/student-dashboard/black-marks')}
              >
                View Details
              </Button>
            </div>
          </DashboardCard>

          <DashboardCard 
            title="Course Completion" 
            icon={<BookOpen className="h-5 w-5" />}
          >
            <div className="flex flex-col gap-3">
              {mockCourses.slice(0, 2).map((course) => (
                <div key={course.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{course.code}</span>
                    <span>{getSyllabusCompletionRate(course.id).toFixed(0)}%</span>
                  </div>
                  <Progress value={getSyllabusCompletionRate(course.id)} className="h-1.5" />
                </div>
              ))}
              <Button 
                variant="link" 
                className="px-0 h-auto" 
                onClick={() => navigate('/student-dashboard/syllabus')}
              >
                View All Courses
              </Button>
            </div>
          </DashboardCard>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          {/* Events Card */}
          <DashboardCard 
            title="Upcoming Events" 
            icon={<Calendar className="h-5 w-5" />}
            actionButton={
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8"
                onClick={() => navigate('/student-dashboard/events')}
              >
                View All
              </Button>
            }
          >
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="border-l-4 border-primary pl-3 py-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(event.startDate), 'MMM d, yyyy')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.location}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No upcoming events
                </p>
              )}
            </div>
          </DashboardCard>

          {/* Competitions Card */}
          <DashboardCard 
            title="Competitions" 
            icon={<Trophy className="h-5 w-5" />}
            actionButton={
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8"
                onClick={() => navigate('/student-dashboard/competitions')}
              >
                View All
              </Button>
            }
          >
            <div className="space-y-4">
              {upcomingCompetitions.length > 0 ? (
                upcomingCompetitions.map((competition) => (
                  <div key={competition.id} className="space-y-1">
                    <h4 className="font-medium">{competition.title}</h4>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {format(new Date(competition.date), 'MMM d, yyyy')}
                      </span>
                      <span className="text-primary font-medium">
                        {competition.participants.includes(userId) 
                          ? 'Registered' 
                          : 'Register Now'}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2">
                      {competition.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No upcoming competitions
                </p>
              )}
            </div>
          </DashboardCard>

          {/* Campus Assistant */}
          <div className="lg:row-span-2">
            <DashboardCard 
              title="Campus Buddy" 
              icon={<MessageSquare className="h-5 w-5" />}
              actionButton={
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8"
                  onClick={() => navigate('/student-dashboard/chat')}
                >
                  Full Chat
                </Button>
              }
            >
              <ChatBot />
            </DashboardCard>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default StudentDashboard;

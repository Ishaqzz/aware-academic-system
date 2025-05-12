
import React, { useState } from 'react';
import { 
  Users, 
  BarChart, 
  AlertCircle, 
  MessageSquare,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '@/components/SidebarLayout';
import DashboardCard from '@/components/DashboardCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import BlackMarkAssignForm from '@/components/BlackMarkAssignForm';
import {
  mockBlackMarks,
  mockFeedback,
  mockTimeSlots
} from '@/services/mockData';
import { format } from 'date-fns';

const FacultyDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{id: string, name: string} | null>(null);
  
  // Mock student data
  const mockStudents = [
    { id: 'student1', name: 'John Doe', totalBlackMarks: 3, attendance: 85, performance: 72 },
    { id: 'student2', name: 'Alice Smith', totalBlackMarks: 0, attendance: 95, performance: 89 },
    { id: 'student3', name: 'Bob Johnson', totalBlackMarks: 7, attendance: 62, performance: 61 },
    { id: 'student4', name: 'Emma Wilson', totalBlackMarks: 1, attendance: 90, performance: 76 },
  ];
  
  // Get black marks issued by current faculty
  const facultyBlackMarks = mockBlackMarks.filter(mark => mark.issuedBy === currentUser?.id);
  
  // Get feedback for the current faculty
  const facultyFeedback = mockFeedback.filter(
    feedback => feedback.targetId === currentUser?.id && feedback.targetType === 'faculty'
  );

  // Sort students by black marks (descending)
  const sortedStudents = [...mockStudents].sort((a, b) => b.totalBlackMarks - a.totalBlackMarks);

  // Get today's classes
  const today = new Date();
  const dayOfWeek = format(today, 'EEEE');
  const todaysClasses = mockTimeSlots.filter(slot => slot.day === dayOfWeek);

  const handleAssignBlackMark = (studentId: string, studentName: string) => {
    setSelectedStudent({ id: studentId, name: studentName });
    setAssignDialogOpen(true);
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 80) return 'bg-green-100 text-green-700 hover:bg-green-100';
    if (value >= 60) return 'bg-amber-100 text-amber-700 hover:bg-amber-100';
    return 'bg-red-100 text-red-700 hover:bg-red-100';
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Faculty Dashboard</h1>
          <p className="text-muted-foreground">Monitor students and manage your courses</p>
        </div>

        <Separator />

        {/* Status Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard 
            title="Total Students" 
            icon={<Users className="h-5 w-5" />}
          >
            <div className="text-3xl font-bold">{mockStudents.length}</div>
            <p className="text-sm text-muted-foreground">Active students in your courses</p>
          </DashboardCard>

          <DashboardCard 
            title="Black Marks Assigned" 
            icon={<AlertCircle className="h-5 w-5" />}
          >
            <div className="text-3xl font-bold">{facultyBlackMarks.length}</div>
            <p className="text-sm text-muted-foreground">Disciplinary records issued</p>
          </DashboardCard>

          <DashboardCard 
            title="Feedback Received" 
            icon={<MessageSquare className="h-5 w-5" />}
          >
            <div className="text-3xl font-bold">{facultyFeedback.length}</div>
            <p className="text-sm text-muted-foreground">Anonymous student feedback</p>
          </DashboardCard>

          <DashboardCard 
            title="Today's Classes" 
            icon={<Clock className="h-5 w-5" />}
          >
            <div className="text-3xl font-bold">{todaysClasses.length}</div>
            <p className="text-sm text-muted-foreground">{format(today, 'EEEE, MMMM d')}</p>
          </DashboardCard>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Student Overview */}
          <DashboardCard 
            title="Student Overview" 
            icon={<BarChart className="h-5 w-5" />}
            actionButton={
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8"
                onClick={() => navigate('/faculty-dashboard/students')}
              >
                View All
              </Button>
            }
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Black Marks</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStudents.map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        student.totalBlackMarks >= 5 
                          ? 'bg-red-100 text-red-700 hover:bg-red-100'
                          : student.totalBlackMarks > 0
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                          : 'bg-green-100 text-green-700 hover:bg-green-100'
                      }>
                        {student.totalBlackMarks} marks
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={student.performance} className="h-1.5 w-16" />
                        <Badge variant="outline" className={getPerformanceColor(student.performance)}>
                          {student.performance}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleAssignBlackMark(student.id, student.name)}
                      >
                        Assign Mark
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DashboardCard>

          {/* Today's Schedule */}
          <DashboardCard 
            title="Today's Schedule" 
            icon={<Clock className="h-5 w-5" />}
            actionButton={
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8"
                onClick={() => navigate('/faculty-dashboard/timetable')}
              >
                Full Timetable
              </Button>
            }
          >
            <div className="space-y-4">
              {todaysClasses.length > 0 ? (
                todaysClasses.map((slot, index) => {
                  const course = { name: 'Introduction to Computer Science', code: 'CS101' };
                  return (
                    <div 
                      key={index} 
                      className="flex items-center p-3 border rounded-lg gap-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="text-center px-3 py-2 rounded-md bg-primary/10 text-primary">
                        <div className="text-sm font-medium">{slot.startTime}</div>
                        <div className="text-xs text-muted-foreground">{slot.endTime}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{course.name}</h4>
                        <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                          <span>{course.code}</span>
                          <span>{slot.roomNumber}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Take Attendance
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground mb-2">No classes scheduled for today</p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/faculty-dashboard/timetable')}
                  >
                    View Full Schedule
                  </Button>
                </div>
              )}
            </div>
          </DashboardCard>
        </div>

        {/* Black Mark Assignment Dialog */}
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Black Mark</DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <BlackMarkAssignForm 
                userId={selectedStudent.id}
                userName={selectedStudent.name}
                userRole="student"
                onSuccess={() => setAssignDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarLayout>
  );
};

export default FacultyDashboard;


import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import DashboardCard from '@/components/DashboardCard';
import { useAuth } from '@/contexts/AuthContext';
import { 
  AlertCircle,
  AlertTriangle,
  Check,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { mockBlackMarks } from '@/services/mockData';
import { format } from 'date-fns';
import BlackMarkAssignForm from '@/components/BlackMarkAssignForm';

const FacultyBlackMarks = () => {
  const { currentUser } = useAuth();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{id: string, name: string} | null>(null);

  // Mock students data for demonstration
  const mockStudents = [
    { id: 'student1', name: 'John Doe', email: 'john.doe@example.com', blackMarkPoints: 3 },
    { id: 'student2', name: 'Alice Smith', email: 'alice.smith@example.com', blackMarkPoints: 0 },
    { id: 'student3', name: 'Bob Johnson', email: 'bob.johnson@example.com', blackMarkPoints: 7 },
    { id: 'student4', name: 'Emma Wilson', email: 'emma.wilson@example.com', blackMarkPoints: 1 },
    { id: 'student5', name: 'Michael Brown', email: 'michael.brown@example.com', blackMarkPoints: 4 },
    { id: 'student6', name: 'Sophia Davis', email: 'sophia.davis@example.com', blackMarkPoints: 9 },
  ];

  // Get black marks assigned by the current faculty
  const facultyBlackMarks = mockBlackMarks.filter(mark => mark.issuedBy === currentUser?.id);

  const handleAssignBlackMark = (studentId: string, studentName: string) => {
    setSelectedStudent({ id: studentId, name: studentName });
    setAssignDialogOpen(true);
  };

  // Get students with different black mark levels
  const atRiskStudents = mockStudents.filter(student => student.blackMarkPoints >= 7);
  const warningStudents = mockStudents.filter(student => student.blackMarkPoints >= 3 && student.blackMarkPoints < 7);
  const goodStandingStudents = mockStudents.filter(student => student.blackMarkPoints < 3);

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Black Mark System</h1>
          <p className="text-muted-foreground">Manage disciplinary records and student behavior</p>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <DashboardCard
            title="AI-Powered Fairness"
            icon={<Sparkles className="h-5 w-5 text-blue-500" />}
          >
            <p className="text-sm">
              The Black Mark System uses AI to analyze context, history, and academic pressure when evaluating student behavior, ensuring fair and consistent discipline.
            </p>
            <div className="mt-3 p-2 bg-blue-50 rounded-md text-xs text-blue-600">
              AI reduces personal bias by considering multiple factors before finalizing black mark points.
            </div>
          </DashboardCard>

          <DashboardCard
            title="Progressive Discipline"
            icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
          >
            <p className="text-sm">
              First-time mistakes carry fewer points than repeated violations. The system is designed to educate and correct behavior before escalating consequences.
            </p>
            <div className="mt-3 p-2 bg-amber-50 rounded-md text-xs text-amber-600">
              The AI suggests interventions at different thresholds before severe consequences become necessary.
            </div>
          </DashboardCard>

          <DashboardCard
            title="Automated Interventions"
            icon={<Check className="h-5 w-5 text-green-500" />}
          >
            <p className="text-sm">
              When students accumulate black marks, the system automatically suggests appropriate interventions based on their specific situation.
            </p>
            <div className="mt-3 p-2 bg-green-50 rounded-md text-xs text-green-600">
              Interventions include academic counseling, mentor meetings, time management workshops, and stress management resources.
            </div>
          </DashboardCard>
        </div>

        <Tabs defaultValue="at-risk">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="at-risk" className="gap-1">
                <AlertTriangle className="h-4 w-4" /> At Risk
                {atRiskStudents.length > 0 && (
                  <Badge variant="outline" className="ml-1 bg-red-100 text-red-700 hover:bg-red-100">
                    {atRiskStudents.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="warning" className="gap-1">
                <AlertCircle className="h-4 w-4" /> Warning
                {warningStudents.length > 0 && (
                  <Badge variant="outline" className="ml-1 bg-amber-100 text-amber-700 hover:bg-amber-100">
                    {warningStudents.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="good" className="gap-1">
                <Check className="h-4 w-4" /> Good Standing
                {goodStandingStudents.length > 0 && (
                  <Badge variant="outline" className="ml-1 bg-green-100 text-green-700 hover:bg-green-100">
                    {goodStandingStudents.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="at-risk">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Black Mark Points</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {atRiskStudents.length > 0 ? (
                    atRiskStudents.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-100 text-red-700 hover:bg-red-100">
                            {student.blackMarkPoints} points
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignBlackMark(student.id, student.name)}
                          >
                            Assign Mark
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No students at risk
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="warning">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Black Mark Points</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warningStudents.length > 0 ? (
                    warningStudents.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                            {student.blackMarkPoints} points
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignBlackMark(student.id, student.name)}
                          >
                            Assign Mark
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No students with warnings
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="good">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Black Mark Points</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goodStandingStudents.length > 0 ? (
                    goodStandingStudents.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100">
                            {student.blackMarkPoints} points
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignBlackMark(student.id, student.name)}
                          >
                            Assign Mark
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No students in good standing
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facultyBlackMarks.length > 0 ? (
                    facultyBlackMarks.map(mark => (
                      <TableRow key={mark.id}>
                        <TableCell>{format(new Date(mark.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="font-medium">
                          {mockStudents.find(s => s.id === mark.userId)?.name || 'Unknown Student'}
                        </TableCell>
                        <TableCell className="capitalize">{mark.type.replace('_', ' ')}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            mark.severity === 'high' 
                              ? 'bg-red-100 text-red-700 hover:bg-red-100'
                              : mark.severity === 'medium'
                              ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                              : 'bg-green-100 text-green-700 hover:bg-green-100'
                          }>
                            {mark.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>{mark.points}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No black marks assigned
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

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

export default FacultyBlackMarks;

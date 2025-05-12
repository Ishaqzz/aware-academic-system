
import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import DashboardCard from '@/components/DashboardCard';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart, 
  BookOpen, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap
} from 'lucide-react';
import { 
  mockGrades, 
  mockCourses, 
  getUserCourses,
  getUserGrades,
  calculateAverageGrade
} from '@/services/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const GradesPage = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || '';
  
  // Get user courses and grades
  const userCourses = getUserCourses(userId);
  const userGrades = getUserGrades(userId);
  
  // Calculate semester GPA (mock)
  const currentSemesterGPA = 3.7;
  const previousSemesterGPA = 3.5;
  
  // Get grade distribution
  const getGradeDistribution = (grades: any[]) => {
    const ranges = {
      excellent: { min: 90, count: 0 },
      good: { min: 80, count: 0 },
      average: { min: 70, count: 0 },
      belowAverage: { min: 60, count: 0 },
      poor: { min: 0, count: 0 }
    };
    
    grades.forEach(grade => {
      const percentage = (grade.score / grade.maxScore) * 100;
      
      if (percentage >= ranges.excellent.min) ranges.excellent.count++;
      else if (percentage >= ranges.good.min) ranges.good.count++;
      else if (percentage >= ranges.average.min) ranges.average.count++;
      else if (percentage >= ranges.belowAverage.min) ranges.belowAverage.count++;
      else ranges.poor.count++;
    });
    
    return ranges;
  };
  
  const gradeDistribution = getGradeDistribution(userGrades);
  
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Academic Record</h1>
          <p className="text-muted-foreground">View your grades, GPA, and academic progress</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <DashboardCard
            title="Current Semester"
            icon={<GraduationCap className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">GPA</span>
                <span className="text-2xl font-bold">{currentSemesterGPA.toFixed(2)}</span>
              </div>
              <Progress 
                value={(currentSemesterGPA / 4) * 100} 
                className="h-2" 
              />
              <div className="text-xs text-right text-muted-foreground">
                Out of 4.0
              </div>
              
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="text-sm font-medium mb-2">
                  Enrolled Courses: {userCourses.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Spring 2024
                </div>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Previous Semester"
            icon={<Calendar className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">GPA</span>
                <span className="text-2xl font-bold">{previousSemesterGPA.toFixed(2)}</span>
              </div>
              <Progress 
                value={(previousSemesterGPA / 4) * 100} 
                className="h-2" 
              />
              <div className="text-xs text-right text-muted-foreground">
                Out of 4.0
              </div>
              
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="text-sm font-medium mb-2">
                  Completed Courses: 4
                </div>
                <div className="text-xs text-muted-foreground">
                  Fall 2023
                </div>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Grade Distribution"
            icon={<BarChart className="h-5 w-5" />}
          >
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Excellent (90-100%)</span>
                  <span>{gradeDistribution.excellent.count}</span>
                </div>
                <Progress 
                  value={(gradeDistribution.excellent.count / userGrades.length) * 100} 
                  className="h-1.5 bg-muted/50"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Good (80-89%)</span>
                  <span>{gradeDistribution.good.count}</span>
                </div>
                <Progress 
                  value={(gradeDistribution.good.count / userGrades.length) * 100} 
                  className="h-1.5 bg-muted/50"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Average (70-79%)</span>
                  <span>{gradeDistribution.average.count}</span>
                </div>
                <Progress 
                  value={(gradeDistribution.average.count / userGrades.length) * 100} 
                  className="h-1.5 bg-muted/50"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Below Avg (60-69%)</span>
                  <span>{gradeDistribution.belowAverage.count}</span>
                </div>
                <Progress 
                  value={(gradeDistribution.belowAverage.count / userGrades.length) * 100} 
                  className="h-1.5 bg-muted/50"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Poor (0-59%)</span>
                  <span>{gradeDistribution.poor.count}</span>
                </div>
                <Progress 
                  value={(gradeDistribution.poor.count / userGrades.length) * 100} 
                  className="h-1.5 bg-muted/50"
                />
              </div>
            </div>
          </DashboardCard>
        </div>
        
        <Tabs defaultValue="current">
          <TabsList>
            <TabsTrigger value="current">Current Semester</TabsTrigger>
            <TabsTrigger value="previous">Previous Semester</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="pt-4">
            <h2 className="text-xl font-semibold mb-4">Course Grades</h2>
            {userCourses.length > 0 ? (
              <div className="space-y-8">
                {userCourses.map(course => (
                  <CourseGrades 
                    key={course.id} 
                    course={course} 
                    userId={userId} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No courses found</h3>
                <p className="text-muted-foreground mt-2">
                  You are not enrolled in any courses this semester
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="previous" className="pt-4">
            <h2 className="text-xl font-semibold mb-4">Previous Semester</h2>
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Previous semester data</h3>
              <p className="text-muted-foreground mt-2">
                Fall 2023 - 4 courses completed with 3.5 GPA
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

// Course Grades Component
const CourseGrades = ({ course, userId }: { course: any, userId: string }) => {
  const [expanded, setExpanded] = useState(false);
  const courseGrades = getUserGrades(userId, course.id);
  const averageGrade = calculateAverageGrade(userId, course.id);
  
  return (
    <div className="border rounded-md overflow-hidden">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer bg-muted/20"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className="font-medium">{course.code}: {course.name}</div>
          <div className="text-sm text-muted-foreground">Credits: {course.credits}</div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-medium">{averageGrade.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Overall</div>
          </div>
          
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="p-4">
          {courseGrades.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseGrades.map(grade => (
                  <TableRow key={grade.id}>
                    <TableCell className="capitalize">{grade.type}</TableCell>
                    <TableCell>{format(new Date(grade.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{grade.score}/{grade.maxScore}</TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        (grade.score / grade.maxScore) * 100 >= 90 ? "text-green-600" : 
                        (grade.score / grade.maxScore) * 100 >= 70 ? "text-amber-600" : 
                        "text-red-600"
                      )}>
                        {((grade.score / grade.maxScore) * 100).toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No grades recorded for this course yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GradesPage;


import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import DashboardCard from '@/components/DashboardCard';
import { useAuth } from '@/contexts/AuthContext';
import { Book, CheckCircle, Circle, BarChart } from 'lucide-react';
import { 
  mockSyllabus, 
  mockCourses, 
  getUserCourses,
  getSyllabusCompletionRate
} from '@/services/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const SyllabusPage = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || '';
  const userCourses = getUserCourses(userId);
  
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    userCourses.length > 0 ? userCourses[0].id : ''
  );
  
  const selectedCourse = mockCourses.find(course => course.id === selectedCourseId);
  const courseSyllabus = mockSyllabus.find(syl => syl.courseId === selectedCourseId);
  const completionRate = getSyllabusCompletionRate(selectedCourseId);
  
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Syllabus</h1>
          <p className="text-muted-foreground">Track your course syllabus progress</p>
        </div>
        
        {userCourses.length > 0 ? (
          <>
            <Select 
              value={selectedCourseId} 
              onValueChange={setSelectedCourseId}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {userCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code}: {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedCourse && (
              <DashboardCard
                title={`${selectedCourse.code}: ${selectedCourse.name}`}
                icon={<Book className="h-5 w-5" />}
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Course Completion</h3>
                      <Badge variant="outline">
                        {completionRate.toFixed(0)}% Complete
                      </Badge>
                    </div>
                    <Progress value={completionRate} />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Topics</h3>
                    
                    {courseSyllabus ? (
                      <div className="space-y-2">
                        {courseSyllabus.topics.map((topic) => (
                          <div 
                            key={topic.id} 
                            className={cn(
                              "p-3 rounded-md border flex items-center justify-between",
                              topic.completed ? "bg-muted/30" : ""
                            )}
                          >
                            <div className="flex items-center gap-3">
                              {topic.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                              )}
                              <span>{topic.title}</span>
                            </div>
                            
                            {topic.completed && topic.completedDate && (
                              <div className="text-sm text-muted-foreground">
                                Completed on {new Date(topic.completedDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No syllabus found for this course</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-md border flex items-start gap-3">
                    <BarChart className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Course Details</h3>
                      <p className="text-sm mt-1">{selectedCourse.description}</p>
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Credits: </span>
                        <span>{selectedCourse.credits}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-medium">No courses found</h2>
            <p className="text-muted-foreground mt-2">
              You are not enrolled in any courses at the moment
            </p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default SyllabusPage;


import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import DashboardCard from '@/components/DashboardCard';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock } from 'lucide-react';
import { mockTimeSlots, mockCourses, getUserCourses } from '@/services/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

const TimetablePage = () => {
  const { currentUser } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const userId = currentUser?.id || '';
  const userCourses = getUserCourses(userId);
  
  // Filter time slots based on courses the user is enrolled in/teaches
  const userCourseIds = userCourses.map(course => course.id);
  
  // Get time slots for the selected day
  const dayTimeSlots = mockTimeSlots
    .filter(slot => slot.day === selectedDay && userCourseIds.includes(slot.courseId))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  // Function to get course details
  const getCourseDetails = (courseId: string) => {
    return mockCourses.find(course => course.id === courseId);
  };
  
  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Timetable</h1>
          <p className="text-muted-foreground">View your weekly schedule</p>
        </div>
        
        <div className="flex justify-between items-center">
          <Select 
            value={selectedDay} 
            onValueChange={setSelectedDay}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        
        <DashboardCard 
          title={`${selectedDay}'s Schedule`}
          icon={<Calendar className="h-5 w-5" />}
        >
          {dayTimeSlots.length > 0 ? (
            <div className="space-y-4">
              {dayTimeSlots.map((slot, index) => {
                const course = getCourseDetails(slot.courseId);
                return (
                  <div 
                    key={index} 
                    className={cn(
                      "p-4 rounded-md border flex flex-col sm:flex-row sm:items-center sm:justify-between",
                      index % 2 === 0 ? "bg-muted/30" : ""
                    )}
                  >
                    <div className="space-y-1">
                      <div className="font-medium">
                        {course?.code}: {course?.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {slot.roomNumber}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No classes scheduled for {selectedDay}</p>
            </div>
          )}
        </DashboardCard>
        
        <DashboardCard
          title="Weekly Overview"
          icon={<Calendar className="h-5 w-5" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {days.map((day) => {
              const daySlots = mockTimeSlots.filter(slot => 
                slot.day === day && userCourseIds.includes(slot.courseId)
              );
              
              return (
                <div 
                  key={day} 
                  className={cn(
                    "p-4 rounded-md border",
                    day === selectedDay ? "border-primary" : "",
                  )}
                  onClick={() => setSelectedDay(day)}
                >
                  <h3 className="font-medium mb-2">{day}</h3>
                  <div className="space-y-1">
                    {daySlots.length > 0 ? (
                      daySlots.map((slot, i) => {
                        const course = getCourseDetails(slot.courseId);
                        return (
                          <div key={i} className="text-sm">
                            <span>{slot.startTime}</span>
                            <span> - </span>
                            <span className="font-medium">{course?.code}</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-sm text-muted-foreground">No classes</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardCard>
      </div>
    </SidebarLayout>
  );
};

export default TimetablePage;

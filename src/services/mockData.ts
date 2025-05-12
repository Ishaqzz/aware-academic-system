
import { subDays, addDays, format } from 'date-fns';

// Types
export type BlackMarkType = 
  | 'absenteeism' 
  | 'misconduct' 
  | 'academic_dishonesty' 
  | 'property_damage'
  | 'rule_violation';

export type BlackMarkSeverity = 'low' | 'medium' | 'high';

export interface BlackMark {
  id: string;
  userId: string;
  type: BlackMarkType;
  description: string;
  severity: BlackMarkSeverity;
  points: number;
  date: string;
  issuedBy?: string;
  context?: string;
}

export interface Attendance {
  id: string;
  userId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  courseId: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  credits: number;
  description: string;
}

export interface Grade {
  id: string;
  userId: string;
  courseId: string;
  score: number;
  maxScore: number;
  type: 'assignment' | 'quiz' | 'midterm' | 'final' | 'project';
  date: string;
}

export interface Feedback {
  id: string;
  targetId: string; // ID of user or entity receiving feedback
  targetType: 'faculty' | 'course' | 'college';
  content: string;
  rating: number;
  date: string;
  isAnonymous: boolean;
  isSensitive: boolean;
  submittedBy?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: 'academic' | 'cultural' | 'sports' | 'workshop' | 'competition';
  organizer: string;
}

export interface Syllabus {
  courseId: string;
  topics: {
    id: string;
    title: string;
    completed: boolean;
    completedDate?: string;
  }[];
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  courseId: string;
  roomNumber: string;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  registrationDeadline: string;
  date: string;
  prizes: string[];
  organizer: string;
  participants: string[];
}

// Generate mock data
const today = new Date();

// Mock black marks
export const mockBlackMarks: BlackMark[] = [
  {
    id: '1',
    userId: 'student1',
    type: 'absenteeism',
    description: 'Missed three consecutive classes without notice',
    severity: 'medium',
    points: 2,
    date: format(subDays(today, 7), 'yyyy-MM-dd'),
    issuedBy: 'faculty1',
    context: 'First occurrence this semester'
  },
  {
    id: '2',
    userId: 'student1',
    type: 'rule_violation',
    description: 'Late submission of assignment',
    severity: 'low',
    points: 1,
    date: format(subDays(today, 14), 'yyyy-MM-dd'),
    issuedBy: 'faculty1'
  },
  {
    id: '3',
    userId: 'faculty1',
    type: 'misconduct',
    description: 'Reported for unprofessional behavior',
    severity: 'medium',
    points: 3,
    date: format(subDays(today, 20), 'yyyy-MM-dd'),
    issuedBy: 'admin1',
    context: 'Multiple student complaints'
  }
];

// Mock courses
export const mockCourses: Course[] = [
  {
    id: 'course1',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    facultyId: 'faculty1',
    credits: 4,
    description: 'Fundamental concepts of computer programming and algorithmic thinking'
  },
  {
    id: 'course2',
    name: 'Data Structures',
    code: 'CS201',
    facultyId: 'faculty1',
    credits: 4,
    description: 'Implementation and analysis of fundamental data structures'
  },
  {
    id: 'course3',
    name: 'Artificial Intelligence',
    code: 'CS401',
    facultyId: 'faculty1',
    credits: 3,
    description: 'Introduction to AI concepts, algorithms and applications'
  }
];

// Mock attendance records
export const mockAttendance: Attendance[] = [
  {
    id: 'att1',
    userId: 'student1',
    date: format(subDays(today, 1), 'yyyy-MM-dd'),
    status: 'present',
    courseId: 'course1'
  },
  {
    id: 'att2',
    userId: 'student1',
    date: format(subDays(today, 2), 'yyyy-MM-dd'),
    status: 'absent',
    courseId: 'course1'
  },
  {
    id: 'att3',
    userId: 'student1',
    date: format(subDays(today, 3), 'yyyy-MM-dd'),
    status: 'present',
    courseId: 'course2'
  },
  {
    id: 'att4',
    userId: 'student1',
    date: format(subDays(today, 4), 'yyyy-MM-dd'),
    status: 'late',
    courseId: 'course3'
  }
];

// Mock grades
export const mockGrades: Grade[] = [
  {
    id: 'grade1',
    userId: 'student1',
    courseId: 'course1',
    score: 85,
    maxScore: 100,
    type: 'assignment',
    date: format(subDays(today, 10), 'yyyy-MM-dd')
  },
  {
    id: 'grade2',
    userId: 'student1',
    courseId: 'course1',
    score: 72,
    maxScore: 100,
    type: 'quiz',
    date: format(subDays(today, 15), 'yyyy-MM-dd')
  },
  {
    id: 'grade3',
    userId: 'student1',
    courseId: 'course2',
    score: 91,
    maxScore: 100,
    type: 'midterm',
    date: format(subDays(today, 20), 'yyyy-MM-dd')
  }
];

// Mock feedback
export const mockFeedback: Feedback[] = [
  {
    id: 'feedback1',
    targetId: 'faculty1',
    targetType: 'faculty',
    content: 'Explains concepts clearly but goes too fast sometimes',
    rating: 4,
    date: format(subDays(today, 5), 'yyyy-MM-dd'),
    isAnonymous: true,
    isSensitive: false
  },
  {
    id: 'feedback2',
    targetId: 'course1',
    targetType: 'course',
    content: 'Course material is outdated and needs revision',
    rating: 3,
    date: format(subDays(today, 8), 'yyyy-MM-dd'),
    isAnonymous: true,
    isSensitive: false
  },
  {
    id: 'feedback3',
    targetId: 'faculty1',
    targetType: 'faculty',
    content: 'Made inappropriate comments during class',
    rating: 2,
    date: format(subDays(today, 12), 'yyyy-MM-dd'),
    isAnonymous: true,
    isSensitive: true
  }
];

// Mock events
export const mockEvents: Event[] = [
  {
    id: 'event1',
    title: 'Annual Tech Symposium',
    description: 'Showcasing the latest innovations from our students',
    startDate: format(addDays(today, 5), 'yyyy-MM-dd'),
    endDate: format(addDays(today, 7), 'yyyy-MM-dd'),
    location: 'Main Auditorium',
    type: 'academic',
    organizer: 'Computer Science Department'
  },
  {
    id: 'event2',
    title: 'Campus Hackathon',
    description: '24-hour coding challenge with exciting prizes',
    startDate: format(addDays(today, 10), 'yyyy-MM-dd'),
    endDate: format(addDays(today, 11), 'yyyy-MM-dd'),
    location: 'Innovation Lab',
    type: 'competition',
    organizer: 'Tech Club'
  },
  {
    id: 'event3',
    title: 'Career Fair',
    description: 'Connect with potential employers from tech industry',
    startDate: format(addDays(today, 15), 'yyyy-MM-dd'),
    endDate: format(addDays(today, 15), 'yyyy-MM-dd'),
    location: 'Student Center',
    type: 'workshop',
    organizer: 'Career Services'
  }
];

// Mock competitions
export const mockCompetitions: Competition[] = [
  {
    id: 'comp1',
    title: 'Code Wars',
    description: 'Algorithmic problem solving under time constraints',
    registrationDeadline: format(addDays(today, 3), 'yyyy-MM-dd'),
    date: format(addDays(today, 10), 'yyyy-MM-dd'),
    prizes: ['$500 Gift Card', 'Internship Opportunity', 'Tech Gadgets'],
    organizer: 'Coding Club',
    participants: ['student1']
  },
  {
    id: 'comp2',
    title: 'Design Sprint',
    description: 'UI/UX design challenge for real-world problems',
    registrationDeadline: format(addDays(today, 5), 'yyyy-MM-dd'),
    date: format(addDays(today, 15), 'yyyy-MM-dd'),
    prizes: ['Design Software License', 'Industry Mentorship', 'Certificate'],
    organizer: 'Design Department',
    participants: []
  }
];

// Mock syllabus
export const mockSyllabus: Syllabus[] = [
  {
    courseId: 'course1',
    topics: [
      {
        id: 'topic1',
        title: 'Introduction to Programming Concepts',
        completed: true,
        completedDate: format(subDays(today, 30), 'yyyy-MM-dd')
      },
      {
        id: 'topic2',
        title: 'Variables and Data Types',
        completed: true,
        completedDate: format(subDays(today, 25), 'yyyy-MM-dd')
      },
      {
        id: 'topic3',
        title: 'Control Structures',
        completed: true,
        completedDate: format(subDays(today, 18), 'yyyy-MM-dd')
      },
      {
        id: 'topic4',
        title: 'Functions and Methods',
        completed: false
      },
      {
        id: 'topic5',
        title: 'Object-Oriented Programming',
        completed: false
      }
    ]
  },
  {
    courseId: 'course2',
    topics: [
      {
        id: 'topic1',
        title: 'Arrays and Lists',
        completed: true,
        completedDate: format(subDays(today, 22), 'yyyy-MM-dd')
      },
      {
        id: 'topic2',
        title: 'Stacks and Queues',
        completed: true,
        completedDate: format(subDays(today, 15), 'yyyy-MM-dd')
      },
      {
        id: 'topic3',
        title: 'Trees and Graphs',
        completed: false
      },
      {
        id: 'topic4',
        title: 'Sorting and Searching Algorithms',
        completed: false
      }
    ]
  }
];

// Mock timetable
export const mockTimeSlots: TimeSlot[] = [
  {
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    courseId: 'course1',
    roomNumber: 'Room 101'
  },
  {
    day: 'Monday',
    startTime: '11:00',
    endTime: '12:30',
    courseId: 'course2',
    roomNumber: 'Room 203'
  },
  {
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '10:30',
    courseId: 'course3',
    roomNumber: 'Room 105'
  },
  {
    day: 'Wednesday',
    startTime: '14:00',
    endTime: '15:30',
    courseId: 'course1',
    roomNumber: 'Lab 2'
  },
  {
    day: 'Thursday',
    startTime: '11:00',
    endTime: '12:30',
    courseId: 'course2',
    roomNumber: 'Room 203'
  },
  {
    day: 'Friday',
    startTime: '09:00',
    endTime: '10:30',
    courseId: 'course3',
    roomNumber: 'Room 105'
  }
];

// Common FAQ for the chatbot
export const mockFAQs = [
  {
    question: 'How many black marks before suspension?',
    answer: 'Accumulating 10 black marks in a semester may lead to academic probation, while 15 black marks could result in suspension. The severity of each mark is also taken into consideration.'
  },
  {
    question: 'Where can I find my syllabus?',
    answer: 'Your course syllabi can be found in the Syllabus tab on your student dashboard. Each course has a detailed breakdown of topics and completion status.'
  },
  {
    question: 'How to appeal a black mark?',
    answer: 'To appeal a black mark, go to the Black Marks section, select the mark in question, and click on the "Appeal" button. Provide a clear explanation for your appeal.'
  },
  {
    question: 'When are final exams scheduled?',
    answer: 'Final exam schedules are posted in the Timetable section, typically 4 weeks before the exam period begins.'
  },
  {
    question: 'How do I submit anonymous feedback?',
    answer: 'Navigate to the Feedback section, choose the target (faculty, course, or college), write your feedback, and check the "Anonymous" option before submitting.'
  }
];

// AI Intervention suggestions
export const interventionSuggestions = [
  {
    triggerPoints: 3,
    suggestion: 'Consider taking a short break to reset. Studies show a 15-minute walk can improve focus and reduce stress.',
    type: 'wellness'
  },
  {
    triggerPoints: 5,
    suggestion: 'It might be helpful to meet with your academic advisor to discuss your course load and strategies for improvement.',
    type: 'academic'
  },
  {
    triggerPoints: 7,
    suggestion: 'Have you tried time-blocking your study sessions? Research shows it can improve productivity by up to 50%.',
    type: 'productivity'
  },
  {
    triggerPoints: 9,
    suggestion: 'Consider joining a study group for courses you're struggling with. Peer learning can significantly improve understanding.',
    type: 'social'
  }
];

// Chatbot motivational quotes
export const motivationalQuotes = [
  "The best way to predict your future is to create it.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Your time is limited, don't waste it living someone else's life.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "It's not about having time, it's about making time.",
  "You are never too old to set another goal or to dream a new dream."
];

// Helper function to get user's total black marks
export const getUserBlackMarks = (userId: string) => {
  return mockBlackMarks.filter(mark => mark.userId === userId);
};

// Helper function to get user's total black mark points
export const getUserBlackMarkPoints = (userId: string) => {
  const userMarks = getUserBlackMarks(userId);
  return userMarks.reduce((total, mark) => total + mark.points, 0);
};

// Helper function to get appropriate intervention based on points
export const getInterventionSuggestion = (points: number) => {
  // Sort interventions by trigger points in descending order
  const sortedInterventions = [...interventionSuggestions].sort(
    (a, b) => b.triggerPoints - a.triggerPoints
  );
  
  // Find the first intervention that applies
  for (const intervention of sortedInterventions) {
    if (points >= intervention.triggerPoints) {
      return intervention;
    }
  }
  
  return null;
};

// Helper function to get user's courses
export const getUserCourses = (userId: string) => {
  // For faculty, return courses they teach
  if (userId.startsWith('faculty')) {
    return mockCourses.filter(course => course.facultyId === userId);
  }
  
  // For students, return all courses (in a real app, would filter by enrollment)
  return mockCourses;
};

// Helper function to get user's attendance
export const getUserAttendance = (userId: string, courseId?: string) => {
  if (courseId) {
    return mockAttendance.filter(
      att => att.userId === userId && att.courseId === courseId
    );
  }
  return mockAttendance.filter(att => att.userId === userId);
};

// Helper function to get user's grades
export const getUserGrades = (userId: string, courseId?: string) => {
  if (courseId) {
    return mockGrades.filter(
      grade => grade.userId === userId && grade.courseId === courseId
    );
  }
  return mockGrades.filter(grade => grade.userId === userId);
};

// Helper function to calculate attendance rate
export const calculateAttendanceRate = (userId: string, courseId?: string) => {
  const attendance = getUserAttendance(userId, courseId);
  if (attendance.length === 0) return 0;
  
  const present = attendance.filter(att => att.status === 'present').length;
  const total = attendance.length;
  
  return (present / total) * 100;
};

// Helper function to calculate average grade
export const calculateAverageGrade = (userId: string, courseId?: string) => {
  const grades = getUserGrades(userId, courseId);
  if (grades.length === 0) return 0;
  
  const total = grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0);
  
  return total / grades.length;
};

// Helper function to get course syllabus completion percentage
export const getSyllabusCompletionRate = (courseId: string) => {
  const courseSyllabus = mockSyllabus.find(syl => syl.courseId === courseId);
  if (!courseSyllabus) return 0;
  
  const completed = courseSyllabus.topics.filter(topic => topic.completed).length;
  const total = courseSyllabus.topics.length;
  
  return (completed / total) * 100;
};

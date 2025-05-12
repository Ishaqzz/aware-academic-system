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
  date: Date;
  type: BlackMarkType;
  description: string;
  severity: BlackMarkSeverity;
  points: number;
  issuedBy?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
}

export interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  courseId: string;
  roomNumber: string;
}

export interface Syllabus {
  courseId: string;
  topics: SyllabusTopic[];
}

export interface SyllabusTopic {
  id: string;
  title: string;
  completed: boolean;
  completedDate?: Date;
}

export interface Grade {
  id: string;
  userId: string;
  courseId: string;
  type: string;
  date: Date;
  score: number;
  maxScore: number;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  date: string;
  registrationDeadline: string;
  location: string;
  organizer: string;
  participants: string[];
  prizes: string[];
}

export interface InterventionSuggestion {
  triggerPoints: number;
  suggestion: string;
  type: string;
}

// Mock data
export const mockBlackMarks: BlackMark[] = [
  {
    id: 'bm1',
    userId: 'student1',
    date: subDays(new Date(), 3),
    type: 'absenteeism',
    description: 'Missed 3 classes without valid excuse',
    severity: 'medium',
    points: 2,
    issuedBy: 'faculty1'
  },
  {
    id: 'bm2',
    userId: 'student2',
    date: subDays(new Date(), 7),
    type: 'misconduct',
    description: 'Disruptive behavior during lecture',
    severity: 'low',
    points: 1,
    issuedBy: 'faculty2'
  },
  {
    id: 'bm3',
    userId: 'student1',
    date: subDays(new Date(), 1),
    type: 'academic_dishonesty',
    description: 'Plagiarism on assignment',
    severity: 'high',
    points: 5,
    issuedBy: 'faculty1'
  },
  {
    id: 'bm4',
    userId: 'student3',
    date: subDays(new Date(), 5),
    type: 'property_damage',
    description: 'Damaged lab equipment',
    severity: 'medium',
    points: 3,
    issuedBy: 'faculty2'
  },
  {
    id: 'bm5',
    userId: 'student4',
    date: subDays(new Date(), 2),
    type: 'rule_violation',
    description: 'Violation of campus code of conduct',
    severity: 'low',
    points: 1,
    issuedBy: 'faculty1'
  },
  {
    id: 'bm6',
    userId: 'student5',
    date: subDays(new Date(), 9),
    type: 'absenteeism',
    description: 'Excessive tardiness to class',
    severity: 'low',
    points: 1,
    issuedBy: 'faculty2'
  },
  {
    id: 'bm7',
    userId: 'student6',
    date: subDays(new Date(), 4),
    type: 'misconduct',
    description: 'Inappropriate language towards staff',
    severity: 'medium',
    points: 2,
    issuedBy: 'faculty1'
  },
  {
    id: 'bm8',
    userId: 'student3',
    date: subDays(new Date(), 6),
    type: 'academic_dishonesty',
    description: 'Cheating on exam',
    severity: 'high',
    points: 5,
    issuedBy: 'faculty2'
  },
  {
    id: 'bm9',
    userId: 'student4',
    date: subDays(new Date(), 8),
    type: 'property_damage',
    description: 'Vandalism of school property',
    severity: 'high',
    points: 4,
    issuedBy: 'faculty1'
  },
  {
    id: 'bm10',
    userId: 'student5',
    date: subDays(new Date(), 10),
    type: 'rule_violation',
    description: 'Unauthorized access to restricted area',
    severity: 'medium',
    points: 3,
    issuedBy: 'faculty2'
  },
  {
    id: 'bm11',
    userId: 'student1',
    date: subDays(new Date(), 12),
    type: 'absenteeism',
    description: 'Skipped mandatory workshop',
    severity: 'low',
    points: 1,
    issuedBy: 'faculty1'
  },
  {
    id: 'bm12',
    userId: 'student2',
    date: subDays(new Date(), 15),
    type: 'misconduct',
    description: 'Harassment of fellow student',
    severity: 'high',
    points: 5,
    issuedBy: 'faculty2'
  },
  {
    id: 'bm13',
    userId: 'student6',
    date: subDays(new Date(), 11),
    type: 'academic_dishonesty',
    description: 'Fabrication of data in research project',
    severity: 'high',
    points: 5,
    issuedBy: 'faculty1'
  },
  {
    id: 'bm14',
    userId: 'student3',
    date: subDays(new Date(), 13),
    type: 'property_damage',
    description: 'Intentional damage to library books',
    severity: 'medium',
    points: 3,
    issuedBy: 'faculty2'
  },
  {
    id: 'bm15',
    userId: 'student4',
    date: subDays(new Date(), 14),
    type: 'rule_violation',
    description: 'Unauthorized use of school resources',
    severity: 'low',
    points: 1,
    issuedBy: 'faculty1'
  }
];

export const mockCourses: Course[] = [
  {
    id: 'course1',
    code: 'CS101',
    name: 'Introduction to Computer Science',
    description: 'A foundational course in computer science, covering basic programming concepts and algorithms.',
    credits: 3
  },
  {
    id: 'course2',
    code: 'MATH201',
    name: 'Calculus I',
    description: 'An introductory course to calculus, covering limits, derivatives, and integrals.',
    credits: 4
  },
  {
    id: 'course3',
    code: 'ENG101',
    name: 'Freshman Composition',
    description: 'A course focused on improving writing and critical thinking skills.',
    credits: 3
  },
  {
    id: 'course4',
    code: 'PHYS101',
    name: 'Introduction to Physics',
    description: 'A basic physics course covering mechanics, heat, and sound.',
    credits: 4
  },
  {
    id: 'course5',
    code: 'HIST101',
    name: 'World History',
    description: 'A survey of world history from ancient times to the present.',
    credits: 3
  },
  {
    id: 'course6',
    code: 'ART101',
    name: 'Introduction to Art History',
    description: 'An overview of major periods and movements in art history.',
    credits: 3
  }
];

export const mockTimeSlots: TimeSlot[] = [
  {
    id: 'ts1',
    day: 'Monday',
    startTime: '9:00 AM',
    endTime: '9:50 AM',
    courseId: 'course1',
    roomNumber: '101'
  },
  {
    id: 'ts2',
    day: 'Monday',
    startTime: '10:00 AM',
    endTime: '10:50 AM',
    courseId: 'course2',
    roomNumber: '201'
  },
  {
    id: 'ts3',
    day: 'Tuesday',
    startTime: '11:00 AM',
    endTime: '11:50 AM',
    courseId: 'course3',
    roomNumber: '102'
  },
  {
    id: 'ts4',
    day: 'Wednesday',
    startTime: '2:00 PM',
    endTime: '2:50 PM',
    courseId: 'course4',
    roomNumber: '301'
  },
  {
    id: 'ts5',
    day: 'Thursday',
    startTime: '3:00 PM',
    endTime: '3:50 PM',
    courseId: 'course5',
    roomNumber: '103'
  },
  {
    id: 'ts6',
    day: 'Friday',
    startTime: '1:00 PM',
    endTime: '1:50 PM',
    courseId: 'course6',
    roomNumber: '202'
  },
  {
    id: 'ts7',
    day: 'Tuesday',
    startTime: '9:00 AM',
    endTime: '9:50 AM',
    courseId: 'course2',
    roomNumber: '201'
  },
  {
    id: 'ts8',
    day: 'Wednesday',
    startTime: '10:00 AM',
    endTime: '10:50 AM',
    courseId: 'course3',
    roomNumber: '102'
  },
  {
    id: 'ts9',
    day: 'Thursday',
    startTime: '11:00 AM',
    endTime: '11:50 AM',
    courseId: 'course4',
    roomNumber: '301'
  },
  {
    id: 'ts10',
    day: 'Friday',
    startTime: '2:00 PM',
    endTime: '2:50 PM',
    courseId: 'course5',
    roomNumber: '103'
  },
  {
    id: 'ts11',
    day: 'Monday',
    startTime: '3:00 PM',
    endTime: '3:50 PM',
    courseId: 'course6',
    roomNumber: '202'
  },
  {
    id: 'ts12',
    day: 'Wednesday',
    startTime: '9:00 AM',
    endTime: '9:50 AM',
    courseId: 'course5',
    roomNumber: '103'
  }
];

export const mockSyllabus = [
  {
    courseId: 'course1',
    topics: [
      { id: 'topic1', title: 'Introduction to Programming', completed: true, completedDate: subDays(new Date(), 2) },
      { id: 'topic2', title: 'Data Types and Variables', completed: true, completedDate: subDays(new Date(), 1) },
      { id: 'topic3', title: 'Control Structures', completed: false },
      { id: 'topic4', title: 'Functions', completed: false }
    ]
  },
  {
    courseId: 'course2',
    topics: [
      { id: 'topic5', title: 'Limits', completed: true, completedDate: subDays(new Date(), 3) },
      { id: 'topic6', title: 'Derivatives', completed: false },
      { id: 'topic7', title: 'Integrals', completed: false }
    ]
  },
  {
    courseId: 'course3',
    topics: [
      { id: 'topic8', title: 'Essay Writing', completed: true, completedDate: subDays(new Date(), 4) },
      { id: 'topic9', title: 'Research Methods', completed: false },
      { id: 'topic10', title: 'Critical Analysis', completed: false }
    ]
  },
  {
    courseId: 'course4',
    topics: [
      { id: 'topic11', title: 'Mechanics', completed: true, completedDate: subDays(new Date(), 5) },
      { id: 'topic12', title: 'Heat', completed: false },
      { id: 'topic13', title: 'Sound', completed: false }
    ]
  },
  {
    courseId: 'course5',
    topics: [
      { id: 'topic14', title: 'Ancient Civilizations', completed: true, completedDate: subDays(new Date(), 6) },
      { id: 'topic15', title: 'Medieval History', completed: false },
      { id: 'topic16', title: 'Modern History', completed: false }
    ]
  },
  {
    courseId: 'course6',
    topics: [
      { id: 'topic17', title: 'Renaissance Art', completed: true, completedDate: subDays(new Date(), 7) },
      { id: 'topic18', title: 'Baroque Art', completed: false },
      { id: 'topic19', title: 'Modern Art', completed: false }
    ]
  }
];

export const mockGrades: Grade[] = [
  {
    id: 'grade1',
    userId: 'student1',
    courseId: 'course1',
    type: 'Midterm Exam',
    date: subDays(new Date(), 5),
    score: 85,
    maxScore: 100
  },
  {
    id: 'grade2',
    userId: 'student1',
    courseId: 'course1',
    type: 'Final Exam',
    date: subDays(new Date(), 2),
    score: 92,
    maxScore: 100
  },
  {
    id: 'grade3',
    userId: 'student1',
    courseId: 'course2',
    type: 'Midterm Exam',
    date: subDays(new Date(), 7),
    score: 78,
    maxScore: 100
  },
  {
    id: 'grade4',
    userId: 'student2',
    courseId: 'course1',
    type: 'Midterm Exam',
    date: subDays(new Date(), 6),
    score: 95,
    maxScore: 100
  },
  {
    id: 'grade5',
    userId: 'student2',
    courseId: 'course2',
    type: 'Final Exam',
    date: subDays(new Date(), 3),
    score: 88,
    maxScore: 100
  },
  {
    id: 'grade6',
    userId: 'student3',
    courseId: 'course3',
    type: 'Midterm Exam',
    date: subDays(new Date(), 8),
    score: 70,
    maxScore: 100
  },
  {
    id: 'grade7',
    userId: 'student3',
    courseId: 'course3',
    type: 'Final Exam',
    date: subDays(new Date(), 4),
    score: 75,
    maxScore: 100
  },
  {
    id: 'grade8',
    userId: 'student4',
    courseId: 'course4',
    type: 'Midterm Exam',
    date: subDays(new Date(), 9),
    score: 82,
    maxScore: 100
  },
  {
    id: 'grade9',
    userId: 'student4',
    courseId: 'course4',
    type: 'Final Exam',
    date: subDays(new Date(), 1),
    score: 90,
    maxScore: 100
  },
  {
    id: 'grade10',
    userId: 'student5',
    courseId: 'course5',
    type: 'Midterm Exam',
    date: subDays(new Date(), 10),
    score: 65,
    maxScore: 100
  },
  {
    id: 'grade11',
    userId: 'student5',
    courseId: 'course5',
    type: 'Final Exam',
    date: subDays(new Date(), 11),
    score: 72,
    maxScore: 100
  },
  {
    id: 'grade12',
    userId: 'student6',
    courseId: 'course6',
    type: 'Midterm Exam',
    date: subDays(new Date(), 12),
    score: 98,
    maxScore: 100
  },
  {
    id: 'grade13',
    userId: 'student6',
    courseId: 'course6',
    type: 'Final Exam',
    date: subDays(new Date(), 13),
    score: 95,
    maxScore: 100
  }
];

export const mockCompetitions: Competition[] = [
  {
    id: 'comp1',
    title: 'Coding Challenge',
    description: 'A coding competition to test your programming skills.',
    date: addDays(new Date(), 10).toISOString(),
    registrationDeadline: addDays(new Date(), 5).toISOString(),
    location: 'Online',
    organizer: 'Tech Club',
    participants: ['student1', 'student2', 'student3'],
    prizes: ['1st Place: $500', '2nd Place: $300', '3rd Place: $100']
  },
  {
    id: 'comp2',
    title: 'Debate Tournament',
    description: 'A debate competition to improve your public speaking skills.',
    date: addDays(new Date(), 15).toISOString(),
    registrationDeadline: addDays(new Date(), 7).toISOString(),
    location: 'Campus Auditorium',
    organizer: 'Debate Society',
    participants: ['student4', 'student5', 'student6'],
    prizes: ['Trophy', 'Certificate', 'Scholarship']
  },
  {
    id: 'comp3',
    title: 'Art Exhibition',
    description: 'An art exhibition to showcase your creative talents.',
    date: addDays(new Date(), 20).toISOString(),
    registrationDeadline: addDays(new Date(), 10).toISOString(),
    location: 'Art Gallery',
    organizer: 'Art Club',
    participants: ['student1', 'student4', 'student6'],
    prizes: ['Exhibition Space', 'Art Supplies', 'Cash Prize']
  },
  {
    id: 'comp4',
    title: 'Science Fair',
    description: 'A science fair to present your innovative projects.',
    date: subDays(new Date(), 5).toISOString(),
    registrationDeadline: subDays(new Date(), 10).toISOString(),
    location: 'Science Building',
    organizer: 'Science Society',
    participants: ['student2', 'student3', 'student5'],
    prizes: ['Lab Equipment', 'Research Grant', 'Publication']
  },
  {
    id: 'comp5',
    title: 'Music Concert',
    description: 'A music concert to showcase your musical talents.',
    date: subDays(new Date(), 10).toISOString(),
    registrationDeadline: subDays(new Date(), 15).toISOString(),
    location: 'Music Hall',
    organizer: 'Music Club',
    participants: ['student1', 'student2', 'student4'],
    prizes: ['Recording Session', 'Musical Instruments', 'Concert Tickets']
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
    suggestion: "Consider joining a study group for courses you're struggling with. Peer learning can significantly improve understanding.",
    type: 'social'
  }
];

// Helper functions
export const getUserBlackMarks = (userId: string): BlackMark[] => {
  return mockBlackMarks.filter(mark => mark.userId === userId);
};

export const getUserBlackMarkPoints = (userId: string): number => {
  return getUserBlackMarks(userId).reduce((sum, mark) => sum + mark.points, 0);
};

export const getInterventionSuggestion = (points: number): InterventionSuggestion | undefined => {
  return interventionSuggestions.find(suggestion => points >= suggestion.triggerPoints);
};

export const getUserCourses = (userId: string): Course[] => {
  // Mock implementation: every user is enrolled in all courses
  return mockCourses;
};

export const getSyllabusCompletionRate = (courseId: string): number => {
  const syllabus = mockSyllabus.find(syl => syl.courseId === courseId);
  if (!syllabus) return 0;
  
  const completedTopics = syllabus.topics.filter(topic => topic.completed).length;
  return (completedTopics / syllabus.topics.length) * 100;
};

export const getUserGrades = (userId: string, courseId?: string): Grade[] => {
  let grades = mockGrades.filter(grade => grade.userId === userId);
  if (courseId) {
    grades = grades.filter(grade => grade.courseId === courseId);
  }
  return grades;
};

export const calculateAverageGrade = (userId: string, courseId: string): number => {
  const grades = getUserGrades(userId, courseId);
  if (grades.length === 0) return 0;
  
  const totalScore = grades.reduce((sum, grade) => sum + grade.score, 0);
  const totalMaxScore = grades.reduce((sum, grade) => sum + grade.maxScore, 0);
  
  return (totalScore / totalMaxScore) * 100;
};

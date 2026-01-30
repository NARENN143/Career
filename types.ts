
export enum UserStatus {
  STUDENT = 'Student',
  FRESHER = 'Fresher',
  PROFESSIONAL = 'Professional',
  SWITCHER = 'Career Switcher'
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'skill' | 'project' | 'theory';
  completed: boolean;
  date?: string;
}

export interface RoadmapLevel {
  id: string;
  title: string;
  description: string;
  tasks: RoadmapTask[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string; // Stored as ISO string for persistence
}

export interface CareerProfile {
  name: string;
  status: UserStatus;
  education: string;
  interests: string[];
  strengths: string[];
  weaknesses: string[];
  availableHoursPerDay: number;
  timelineMonths: number;
  selectedCareer?: string;
  roadmap?: RoadmapLevel[];
  onboardingComplete: boolean;
  streak?: number;
  lastEngagementDate?: string;
  chatHistory?: ChatMessage[];
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: 'Job' | 'Internship' | 'Freelance' | 'Hackathon';
  matchScore: number;
  location: string;
  whyMatch: string;
}

export interface Newsletter {
  date: string;
  learningFocus: string;
  industryTrend: string;
  careerTip: string;
  motivation: string;
}

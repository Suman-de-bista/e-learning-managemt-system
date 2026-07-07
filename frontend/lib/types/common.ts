export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Instructor {
  id: number;
  name: string;
  expertise: string;
  bio: string;
}

export interface Course {
  id: number;
  instructor_id: number;
  title: string;
  level: string;
  duration_hours: number;
}
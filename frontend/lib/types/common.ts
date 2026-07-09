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

export type CourseResponse = Omit<Course,"instructor_id"> & {
  instructor_name:string;
}
export type InstructorResponse = Instructor & {
  courses_count:number;
}
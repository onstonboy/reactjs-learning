export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseStatus = 'Active' | 'Draft' | 'Archived';

export interface Course {
  id: string;
  name: string;
  instructor: string;
  level: CourseLevel;
  learnerCount: number;
  status: CourseStatus;
  description: string;
  createdAt: string;
}

export interface CreateCourseInput {
  name: string;
  instructor: string;
  level: CourseLevel;
  status: CourseStatus;
  description: string;
}

export interface CourseFormValues {
  name: string;
  instructor: string;
  level: CourseLevel;
  status: CourseStatus;
  description: string;
}

export type CourseFormErrors = Partial<Record<keyof CourseFormValues, string>>;

import type {
  CourseFormErrors,
  CourseFormValues,
  CourseLevel,
  CourseStatus,
} from '../types/course';

const VALID_LEVELS: readonly CourseLevel[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
];
const VALID_STATUSES: readonly CourseStatus[] = ['Active', 'Draft', 'Archived'];

export function validateCourseForm(values: CourseFormValues): CourseFormErrors {
  const errors: CourseFormErrors = {};
  const name = values.name.trim();
  const instructor = values.instructor.trim();
  const description = values.description.trim();

  if (name.length === 0) {
    errors.name = 'Course name is required.';
  } else if (name.length < 3 || name.length > 100) {
    errors.name = 'Course name must be between 3 and 100 characters.';
  }

  if (instructor.length === 0) {
    errors.instructor = 'Instructor name is required.';
  } else if (instructor.length < 2 || instructor.length > 80) {
    errors.instructor = 'Instructor name must be between 2 and 80 characters.';
  }

  if (!VALID_LEVELS.includes(values.level)) {
    errors.level = 'Please select a valid level.';
  }

  if (!VALID_STATUSES.includes(values.status)) {
    errors.status = 'Please select a valid status.';
  }

  if (description.length === 0) {
    errors.description = 'Description is required.';
  } else if (description.length < 10 || description.length > 500) {
    errors.description = 'Description must be between 10 and 500 characters.';
  }

  return errors;
}

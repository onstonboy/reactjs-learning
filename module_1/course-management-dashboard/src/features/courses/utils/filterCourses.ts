import type { Course, CourseLevel, CourseStatus } from '../types/course';

export type LevelFilter = CourseLevel | 'All';
export type StatusFilter = CourseStatus | 'All';

export function filterCourses(
  courses: Course[],
  searchQuery: string,
  level: LevelFilter,
  status: StatusFilter,
): Course[] {
  const query = searchQuery.trim().toLowerCase();

  return courses.filter((course) => {
    const matchesQuery =
      query.length === 0 ||
      course.name.toLowerCase().includes(query) ||
      course.instructor.toLowerCase().includes(query);
    const matchesLevel = level === 'All' || course.level === level;
    const matchesStatus = status === 'All' || course.status === status;

    return matchesQuery && matchesLevel && matchesStatus;
  });
}

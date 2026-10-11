import type { Course } from '../types/course';

export const mockCourses: Course[] = [
  {
    id: 'course-001',
    name: 'React Fundamentals',
    instructor: 'Ana Nguyen',
    level: 'Beginner',
    learnerCount: 1240,
    status: 'Active',
    description:
      'Learn components, props, state and hooks while building your first React applications.',
    createdAt: '2026-01-12T09:00:00.000Z',
  },
  {
    id: 'course-002',
    name: 'Advanced TypeScript Patterns',
    instructor: 'Minh Tran',
    level: 'Advanced',
    learnerCount: 486,
    status: 'Active',
    description:
      'Master generics, mapped types, discriminated unions and type-safe API layers in TypeScript.',
    createdAt: '2026-02-03T10:30:00.000Z',
  },
  {
    id: 'course-003',
    name: 'CSS Layout Mastery',
    instructor: 'Linh Pham',
    level: 'Intermediate',
    learnerCount: 872,
    status: 'Active',
    description:
      'Deep dive into Flexbox, Grid, container queries and responsive design strategies.',
    createdAt: '2026-02-18T14:15:00.000Z',
  },
  {
    id: 'course-004',
    name: 'Web Accessibility Essentials',
    instructor: 'Ana Nguyen',
    level: 'Beginner',
    learnerCount: 350,
    status: 'Draft',
    description:
      'Build inclusive interfaces with semantic HTML, ARIA and keyboard-first interaction.',
    createdAt: '2026-03-05T08:45:00.000Z',
  },
  {
    id: 'course-005',
    name: 'Node.js API Design',
    instructor: 'Khoa Le',
    level: 'Intermediate',
    learnerCount: 615,
    status: 'Active',
    description:
      'Design, version and document REST APIs with validation, auth and error handling.',
    createdAt: '2026-03-22T11:00:00.000Z',
  },
  {
    id: 'course-006',
    name: 'Legacy jQuery Migration',
    instructor: 'Minh Tran',
    level: 'Intermediate',
    learnerCount: 198,
    status: 'Archived',
    description:
      'A step-by-step guide to migrating jQuery codebases to modern framework-driven UIs.',
    createdAt: '2025-11-30T16:20:00.000Z',
  },
  {
    id: 'course-007',
    name: 'Testing React Applications',
    instructor: 'Linh Pham',
    level: 'Advanced',
    learnerCount: 274,
    status: 'Draft',
    description:
      'Unit, integration and end-to-end testing strategies for React with Vitest and Playwright.',
    createdAt: '2026-04-10T09:30:00.000Z',
  },
  {
    id: 'course-008',
    name: 'JavaScript Foundations',
    instructor: 'Khoa Le',
    level: 'Beginner',
    learnerCount: 2140,
    status: 'Active',
    description:
      'Variables, functions, arrays, objects and async patterns — the base for every web project.',
    createdAt: '2025-09-14T13:00:00.000Z',
  },
];

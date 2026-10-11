import { mockCourses } from '../data/mockCourses';
import type { Course, CreateCourseInput } from '../types/course';

const DEFAULT_DELAY_MS = 600;

let coursesStore: Course[] = mockCourses.map((course) => ({ ...course }));

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function resolveDelay(): number {
  const parsed = Number(import.meta.env.VITE_MOCK_API_DELAY_MS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_DELAY_MS;
}

function shouldFail(): boolean {
  return import.meta.env.VITE_MOCK_API_SHOULD_FAIL === 'true';
}

export async function getCourses(): Promise<Course[]> {
  await delay(resolveDelay());

  if (shouldFail()) {
    throw new Error('Unable to load courses. Please try again.');
  }

  return coursesStore.map((course) => ({ ...course }));
}

export async function createCourse(input: CreateCourseInput): Promise<Course> {
  await delay(resolveDelay());

  if (shouldFail()) {
    throw new Error('Unable to create the course. Please try again.');
  }

  const newCourse: Course = {
    ...input,
    id: crypto.randomUUID(),
    learnerCount: 0,
    createdAt: new Date().toISOString(),
  };

  coursesStore = [newCourse, ...coursesStore];
  return { ...newCourse };
}

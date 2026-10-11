import { useCallback, useEffect, useState } from 'react';
import type { ApiState } from '../../../types/api';
import { createCourse, getCourses } from '../services/courseService';
import type { Course, CreateCourseInput } from '../types/course';
import { getErrorMessage } from '../utils/errors';

export function useCourses() {
  const [coursesState, setCoursesState] = useState<ApiState<Course[]>>({
    status: 'loading',
  });

  const loadCourses = useCallback(async () => {
    setCoursesState({ status: 'loading' });

    try {
      const data = await getCourses();
      setCoursesState({ status: 'success', data });
    } catch (error: unknown) {
      console.error(error);
      setCoursesState({ status: 'error', message: getErrorMessage(error) });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    getCourses()
      .then((data) => {
        if (cancelled) return;
        setCoursesState({ status: 'success', data });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error(error);
        setCoursesState({ status: 'error', message: getErrorMessage(error) });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const addCourse = useCallback(
    async (input: CreateCourseInput): Promise<Course> => {
      const createdCourse = await createCourse(input);

      setCoursesState((previous) => {
        if (previous.status !== 'success') return previous;
        return { status: 'success', data: [createdCourse, ...previous.data] };
      });

      return createdCourse;
    },
    [],
  );

  return { coursesState, loadCourses, addCourse };
}

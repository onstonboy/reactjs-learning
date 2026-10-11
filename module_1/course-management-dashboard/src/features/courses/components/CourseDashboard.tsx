import { useCallback, useRef, useState } from 'react';
import { AppHeader } from '../../../components/layout/AppHeader';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { useCourses } from '../hooks/useCourses';
import type { CourseFormValues } from '../types/course';
import { getErrorMessage } from '../utils/errors';
import type { LevelFilter, StatusFilter } from '../utils/filterCourses';
import { filterCourses } from '../utils/filterCourses';
import { CourseFilters } from './CourseFilters';
import { CourseForm } from './CourseForm';
import { CourseList } from './CourseList';
import { CourseSearch } from './CourseSearch';
import { CourseSummary } from './CourseSummary';

export function CourseDashboard() {
  const { coursesState, loadCourses, addCourse } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const courses = coursesState.status === 'success' ? coursesState.data : [];
  const filteredCourses = filterCourses(
    courses,
    searchQuery,
    levelFilter,
    statusFilter,
  );
  const totalLearners = courses.reduce(
    (sum, course) => sum + course.learnerCount,
    0,
  );
  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    levelFilter !== 'All' ||
    statusFilter !== 'All';

  const openForm = useCallback(() => {
    setSubmitError(null);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setSubmitError(null);
    addButtonRef.current?.focus();
  }, []);

  const handleCancelForm = useCallback(() => {
    if (!isSubmitting) closeForm();
  }, [isSubmitting, closeForm]);

  function clearFilters() {
    setSearchQuery('');
    setLevelFilter('All');
    setStatusFilter('All');
  }

  async function handleCreateCourse(values: CourseFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const createdCourse = await addCourse(values);
      setIsFormOpen(false);
      setNotice(`Course "${createdCourse.name}" was added.`);
      addButtonRef.current?.focus();
    } catch (error: unknown) {
      console.error(error);
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AppHeader onAddCourse={openForm} addButtonRef={addButtonRef} />

      <main className="dashboard">
        <section className="dashboard__intro">
          <div>
            <h1>Course catalog</h1>
            <p>
              Browse, search and manage the courses in your learning program.
            </p>
          </div>
          {coursesState.status === 'success' ? (
            <CourseSummary
              totalCourses={courses.length}
              totalLearners={totalLearners}
            />
          ) : null}
        </section>

        <section className="toolbar" aria-label="Course search and filters">
          <CourseSearch value={searchQuery} onChange={setSearchQuery} />
          <CourseFilters
            level={levelFilter}
            status={statusFilter}
            onLevelChange={setLevelFilter}
            onStatusChange={setStatusFilter}
          />
        </section>

        {notice ? (
          <div className="notice" role="status">
            <p>{notice}</p>
            <Button variant="ghost" onClick={() => setNotice(null)}>
              Dismiss
            </Button>
          </div>
        ) : null}

        {coursesState.status === 'success' && courses.length > 0 ? (
          <div className="results-bar">
            <p className="results-bar__count" aria-live="polite">
              {filteredCourses.length}{' '}
              {filteredCourses.length === 1 ? 'course' : 'courses'}
              {hasActiveFilters ? ' matching filters' : ''}
            </p>
            {hasActiveFilters ? (
              <Button variant="ghost" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : null}
          </div>
        ) : null}

        {coursesState.status === 'idle' || coursesState.status === 'loading' ? (
          <LoadingState />
        ) : coursesState.status === 'error' ? (
          <ErrorState message={coursesState.message} onRetry={loadCourses} />
        ) : courses.length === 0 ? (
          <EmptyState
            title="No courses yet"
            message="Get started by adding the first course to the catalog."
          >
            <Button onClick={openForm}>Add Course</Button>
          </EmptyState>
        ) : filteredCourses.length === 0 ? (
          <EmptyState
            title="No matching courses"
            message="Try adjusting your search terms or clearing the filters."
          >
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          </EmptyState>
        ) : (
          <CourseList courses={filteredCourses} />
        )}
      </main>

      <footer className="app-footer">
        <p>Course Management Dashboard — React module 1 project</p>
      </footer>

      {isFormOpen ? (
        <CourseForm
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSubmit={handleCreateCourse}
          onCancel={handleCancelForm}
        />
      ) : null}
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { FormField } from '../../../components/ui/FormField';
import type {
  CourseFormErrors,
  CourseFormValues,
  CourseLevel,
  CourseStatus,
} from '../types/course';
import { validateCourseForm } from '../utils/validateCourseForm';

const INITIAL_VALUES: CourseFormValues = {
  name: '',
  instructor: '',
  level: 'Beginner',
  status: 'Draft',
  description: '',
};

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface CourseFormProps {
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: (values: CourseFormValues) => void;
  onCancel: () => void;
}

export function CourseForm({
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: CourseFormProps) {
  const [values, setValues] = useState<CourseFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<CourseFormErrors>({});
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog: HTMLDivElement | null = dialogRef.current;
    if (!dialog) return;

    const dialogElement: HTMLDivElement = dialog;
    const firstField = dialog.querySelector<HTMLElement>(
      'input, select, textarea',
    );
    firstField?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        dialogElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => !element.hasAttribute('disabled'));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onCancel]);

  function updateField(field: keyof CourseFormValues, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateCourseForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      name: values.name.trim(),
      instructor: values.instructor.trim(),
      level: values.level,
      status: values.status,
      description: values.description.trim(),
    });
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-form-title"
        ref={dialogRef}
      >
        <div className="modal__header">
          <h2 className="modal__title" id="course-form-title">
            Add a new course
          </h2>
        </div>
        <form className="course-form" onSubmit={handleSubmit} noValidate>
          {submitError ? (
            <p className="form-error-banner" role="alert">
              {submitError}
            </p>
          ) : null}

          <FormField id="course-name" label="Course name" error={errors.name}>
            <input
              id="course-name"
              className="form-field__input"
              type="text"
              value={values.name}
              onChange={(event) => updateField('name', event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'course-name-error' : undefined}
            />
          </FormField>

          <FormField
            id="course-instructor"
            label="Instructor"
            error={errors.instructor}
          >
            <input
              id="course-instructor"
              className="form-field__input"
              type="text"
              value={values.instructor}
              onChange={(event) =>
                updateField('instructor', event.target.value)
              }
              aria-invalid={Boolean(errors.instructor)}
              aria-describedby={
                errors.instructor ? 'course-instructor-error' : undefined
              }
            />
          </FormField>

          <FormField id="course-level" label="Level" error={errors.level}>
            <select
              id="course-level"
              className="form-field__select"
              value={values.level}
              onChange={(event) =>
                updateField('level', event.target.value as CourseLevel)
              }
              aria-invalid={Boolean(errors.level)}
              aria-describedby={errors.level ? 'course-level-error' : undefined}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </FormField>

          <FormField id="course-status" label="Status" error={errors.status}>
            <select
              id="course-status"
              className="form-field__select"
              value={values.status}
              onChange={(event) =>
                updateField('status', event.target.value as CourseStatus)
              }
              aria-invalid={Boolean(errors.status)}
              aria-describedby={
                errors.status ? 'course-status-error' : undefined
              }
            >
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
          </FormField>

          <FormField
            id="course-description"
            label="Description"
            error={errors.description}
          >
            <textarea
              id="course-description"
              className="form-field__textarea"
              value={values.description}
              onChange={(event) =>
                updateField('description', event.target.value)
              }
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description ? 'course-description-error' : undefined
              }
            />
          </FormField>

          <div className="form-actions">
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Create course'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

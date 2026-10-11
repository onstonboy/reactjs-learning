import type { Ref } from 'react';
import { Button } from '../ui/Button';

interface AppHeaderProps {
  onAddCourse: () => void;
  addButtonRef?: Ref<HTMLButtonElement>;
}

export function AppHeader({ onAddCourse, addButtonRef }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__brand">
          <span className="app-header__logo" aria-hidden="true">
            CM
          </span>
          <span className="app-header__title">Course Management Dashboard</span>
        </div>
        <Button onClick={onAddCourse} ref={addButtonRef}>
          Add Course
        </Button>
      </div>
    </header>
  );
}

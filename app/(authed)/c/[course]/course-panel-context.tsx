'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { COURSE_PANEL_COOKIE, COURSE_PANEL_COOKIE_MAX_AGE } from '@/config';

import {
  serializeCoursePanelState,
  type CoursePanelId,
  type CoursePanelState,
} from './course-panel-state';

export const COURSE_PANEL_ID = 'course-panel';

const SIDE_BY_SIDE_QUERY = '(min-width: 64rem)';

type CoursePanelContextValue = {
  panel: CoursePanelId;
  isOpen: boolean;
  isModal: boolean;
  panelRef: React.RefObject<HTMLElement | null>;
  toggle: (panel: CoursePanelId, trigger: HTMLElement | null) => void;
  close: () => void;
};

const CoursePanelContext = createContext<CoursePanelContextValue | undefined>(
  undefined
);

function persist(state: CoursePanelState) {
  const secure = window.location.protocol === 'https:' ? '; secure' : '';

  document.cookie = `${COURSE_PANEL_COOKIE}=${serializeCoursePanelState(state)}; path=/; max-age=${COURSE_PANEL_COOKIE_MAX_AGE}; samesite=lax${secure}`;
}

export function useCoursePanel() {
  const context = useContext(CoursePanelContext);

  if (!context) {
    throw new Error('useCoursePanel must be used inside CoursePanelProvider');
  }

  return context;
}

export function CoursePanelProvider({
  initialState,
  children,
}: {
  initialState: CoursePanelState;
  children: ReactNode;
}) {
  const [panel, setPanel] = useState(initialState.panel);
  const [isOpen, setIsOpen] = useState(initialState.isOpen);
  // Assume side-by-side until measured, so a cookie-restored panel never marks
  // the page inert during hydration.
  const [isSideBySide, setIsSideBySide] = useState(true);
  const panelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  // Only a user-initiated open moves focus. A panel restored from the cookie
  // must not steal focus on page load.
  const focusOnOpenRef = useRef(false);

  const close = useCallback(() => {
    if (panelRef.current?.contains(document.activeElement)) {
      triggerRef.current?.focus();
    }

    setIsOpen(false);
    persist({ panel, isOpen: false });
  }, [panel]);

  const toggle = useCallback(
    (next: CoursePanelId, trigger: HTMLElement | null) => {
      triggerRef.current = trigger;

      const nextOpen = !(isOpen && next === panel);

      focusOnOpenRef.current = nextOpen;
      setPanel(next);
      setIsOpen(nextOpen);
      persist({ panel: next, isOpen: nextOpen });
    },
    [isOpen, panel]
  );

  useEffect(() => {
    const media = window.matchMedia(SIDE_BY_SIDE_QUERY);
    const sync = () => setIsSideBySide(media.matches);

    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (isOpen && focusOnOpenRef.current) {
      focusOnOpenRef.current = false;
      panelRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        close();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close, isOpen]);

  return (
    <CoursePanelContext.Provider
      value={{
        panel,
        isOpen,
        isModal: isOpen && !isSideBySide,
        panelRef,
        toggle,
        close,
      }}
    >
      {children}
    </CoursePanelContext.Provider>
  );
}

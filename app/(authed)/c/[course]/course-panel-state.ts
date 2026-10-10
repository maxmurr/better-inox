export type CoursePanelId = 'comments' | 'lessons';

export type CoursePanelState = {
  panel: CoursePanelId;
  isOpen: boolean;
};

const CLOSED_STATE: CoursePanelState = { panel: 'lessons', isOpen: false };

export function parseCoursePanelState(
  value: string | undefined
): CoursePanelState {
  if (value === 'comments' || value === 'lessons') {
    return { panel: value, isOpen: true };
  }

  return CLOSED_STATE;
}

export function serializeCoursePanelState({ panel, isOpen }: CoursePanelState) {
  return isOpen ? panel : 'closed';
}

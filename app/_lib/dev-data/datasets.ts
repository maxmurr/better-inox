// Dev-only fixture switch for stress-testing the UI with realistic worst-case
// data. Read only behind `NODE_ENV === 'development'` checks.
export const DEV_DATASET_COOKIE = 'dev_dataset';

export const DEV_DATASETS = [
  { id: 'demo', label: 'Demo data' },
  { id: 'worst', label: 'Worst case' },
  { id: 'empty', label: 'Empty' },
  { id: 'one', label: 'One' },
  { id: 'huge', label: '1,284 rows' },
] as const;

export type DevDataset = (typeof DEV_DATASETS)[number]['id'];

export function parseDevDataset(value: string | undefined) {
  return DEV_DATASETS.find((dataset) => dataset.id === value)?.id;
}

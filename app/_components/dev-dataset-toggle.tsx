'use client';

import { useRouter } from 'next/navigation';

import {
  DEV_DATASET_COOKIE,
  DEV_DATASETS,
  type DevDataset,
} from '@/app/_lib/dev-data/datasets';

/** Dev-only switch between real data and the stress-test fixtures. */
export function DevDatasetToggle({
  active,
}: {
  active: DevDataset | undefined;
}) {
  const router = useRouter();

  async function select(dataset: DevDataset | undefined) {
    await (dataset
      ? cookieStore.set({ name: DEV_DATASET_COOKIE, value: dataset, path: '/' })
      : cookieStore.delete({ name: DEV_DATASET_COOKIE, path: '/' }));
    router.refresh();
  }

  const options = [{ id: undefined, label: 'Real' }, ...DEV_DATASETS];

  return (
    <div
      role="radiogroup"
      aria-label="Dev dataset"
      className="fixed bottom-20 left-1/2 z-[100] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-x-auto rounded-full bg-neutral-200 p-1 font-[system-ui] text-xs text-neutral-700 shadow-sm"
    >
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          role="radio"
          aria-checked={active === option.id}
          onClick={() => void select(option.id)}
          className="shrink-0 cursor-pointer rounded-full px-3 py-1 whitespace-nowrap aria-checked:bg-white aria-checked:text-neutral-950 aria-checked:shadow-sm"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

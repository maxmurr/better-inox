import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { findSection } from '../curriculum';

export async function generateMetadata({
  params,
}: PageProps<'/c/four-pillars/[section]'>): Promise<Metadata> {
  const { section } = await params;

  return { title: findSection(section)?.title };
}

export default async function Page({
  params,
}: PageProps<'/c/four-pillars/[section]'>) {
  const { section } = await params;

  if (!findSection(section)) {
    notFound();
  }

  return null;
}

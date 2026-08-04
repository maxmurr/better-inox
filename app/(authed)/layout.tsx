import { getCurrentUser } from './auth';

export default async function AuthedLayout({ children }: LayoutProps<'/'>) {
  await getCurrentUser();

  return children;
}

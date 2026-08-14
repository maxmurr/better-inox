import { redirect } from 'next/navigation';

import { POST_SIGN_IN_REDIRECT } from '@/config';

export default function Page() {
  redirect(POST_SIGN_IN_REDIRECT);
}

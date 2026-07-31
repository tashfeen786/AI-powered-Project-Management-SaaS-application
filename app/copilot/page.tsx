import { redirect } from 'next/navigation';

export default function GlobalCopilotRedirect() {
  redirect('/dashboard');
}

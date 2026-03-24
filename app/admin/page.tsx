"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Ensuring the admin portal requires authentication by redirecting to the login page.
    router.push('/admin/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#00b4d8] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

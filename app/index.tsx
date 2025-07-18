import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login screen when app opens
    router.replace('/login');
  }, [router]);

  return null;
}
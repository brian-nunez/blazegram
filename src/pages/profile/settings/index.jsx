import React from 'react';
import { useRouter } from 'next/router';
import { useLayoutEffect } from 'react';

function Settings() {
  const router = useRouter();

  useLayoutEffect(() => {
    router.push('/profile/settings/edit');
  }, [router]);

  return null;

}

export default Settings;

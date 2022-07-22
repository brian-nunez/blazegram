import React from 'react';
import { useRouter } from 'next/router';
import { useLayoutEffect } from 'react';

function Settings() {
  const router = useRouter();

  useLayoutEffect(() => {
    router.push('/profile/settings/edit');
  }, []);

  return null;

}

export default Settings;

'use client';

import { useEffect } from 'react';
import { getSession, signInAnonymously } from '@/lib/auth';
import { loadAllRemote } from '@/lib/sync';

export function AuthBootstrap() {
  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        signInAnonymously();
      } else {
        loadAllRemote();
      }
    });
  }, []);

  return null;
}

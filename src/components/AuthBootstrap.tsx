'use client';

import { useEffect } from 'react';
import { getSession, signInAnonymously } from '@/lib/auth';
import { registerServiceWorker, checkAndFireDailyReminder, scheduleLocalReminder } from '@/lib/notifications';
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

    registerServiceWorker().then(() => {
      checkAndFireDailyReminder();
      scheduleLocalReminder();
    });
  }, []);

  return null;
}

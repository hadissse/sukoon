#!/usr/bin/env node
// Run once: node scripts/generate-vapid-keys.mjs
// Copy the output into your .env.local and Vercel environment variables.

import webpush from 'web-push';

const keys = webpush.generateVAPIDKeys();

console.log('\nAdd these to .env.local and Vercel dashboard:\n');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log(`VAPID_SUBJECT=mailto:hadievet123@gmail.com`);
console.log('\nKeep VAPID_PRIVATE_KEY server-side only (no NEXT_PUBLIC_ prefix).\n');

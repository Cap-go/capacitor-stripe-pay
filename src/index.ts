import { registerPlugin } from '@capacitor/core';

import type { StripePlugin } from './definitions.js';

const Stripe = registerPlugin<StripePlugin>('Stripe', {
  web: () => import('./web.js').then((m) => new m.StripeWeb()),
});

export * from './definitions.js';
export { Stripe };
